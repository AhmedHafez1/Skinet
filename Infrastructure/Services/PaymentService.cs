using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Product = Core.Entities.Product;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepository;
        private readonly IConfiguration _config;

        public PaymentService(IUnitOfWork unitOfWork, IBasketRepository basketRepository, IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            _config = config;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketid)
        {
            var basket = await _basketRepository.GetBasketAsync(basketid);

            if (basket == null) return null;

            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var shippingPrice = 0m;

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<Delivery>().GetByIdAsync((int)basket.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                if (product.Price != item.Price) item.Price = product.Price;
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * i.Price * 100) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };

                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * i.Price * 100) + (long)shippingPrice * 100
                };

                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }
    }
}


