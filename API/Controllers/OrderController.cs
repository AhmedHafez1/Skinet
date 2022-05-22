using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
            var shipToAddress = _mapper.Map<Address>(orderDto.ShipToAddress);

            var email = User.FindFirstValue(ClaimTypes.Email);

            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, shipToAddress);

            if (order == null) return BadRequest(new ApiResponse(400, "Error in creating the Order"));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrders()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var orders = await _orderService.GetOrdersAsync(email);

            var OrdersToReturn = _mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(OrdersToReturn);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrder(int id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(400));

            var orderToReturnDto = _mapper.Map<OrderToReturnDto>(order);

            return orderToReturnDto;
        }

        [Authorize]
        [HttpGet("deliveryOptions")]
        public async Task<ActionResult<IReadOnlyList<Delivery>>> GetDeliveryOptions()
        {
            var deliveries = await _orderService.GetDeliveryMethodsAsync();

            return Ok(deliveries);
        }
    }
}
