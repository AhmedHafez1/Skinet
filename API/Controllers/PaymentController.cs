using API.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger _logger;

        private const string WebHookSecret = "whsec_b076837122633eb280c979b89ae6ad038933e728462e87a9ddab6324b06a7e16";

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) { return BadRequest(new ApiResponse(400, "Problem in Your Basket")); }

            return Ok(basket);
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WebHookSecret);

            PaymentIntent intent;

            switch (stripeEvent.Type)
            {
                case Events.PaymentIntentSucceeded:
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded", intent.Id);
                    await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);

                    break;
                case Events.PaymentIntentPaymentFailed:
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed", intent.Id);
                    await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    break;
            }

            return new EmptyResult();
        }


    }
}
