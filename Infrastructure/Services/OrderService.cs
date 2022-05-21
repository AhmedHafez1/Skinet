using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {
            _basketRepo = basketRepo;
            _unitOfWork = unitOfWork;
        }



        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress)
        {
            // Get Basket from Basket Repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // Get Product Items from Product Repo
            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                var orderItem = new OrderItem(new ProductItemOrdered(product.Id, product.Name, product.PictureUrl), product.Price, item.Quantity);

                items.Add(orderItem);
            }

            // Get Delivery Method from Delivery Repo
            var delivery = await _unitOfWork.Repository<Delivery>().GetByIdAsync(deliveryMethod);

            // Calc SubTotal
            var subTotal = items.Sum(item => item.Quantity * item.Price);

            // Create Order
            var order = new Order(items, buyerEmail, shippingAddress, delivery, subTotal);
            _unitOfWork.Repository<Order>().Add(order);

            // Save To Db
            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            // Delete The Basket
            await _basketRepo.DeleteBasketAsync(basketId);

            // Return Order
            return order;
        }

        public async Task<IReadOnlyList<Delivery>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<Delivery>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderId, string buyerEmail)
        {
            var spec = new OrderWithOrderItemsAndDeliverySpecification(buyerEmail, orderId);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersAsync(string buyerEmail)
        {
            var spec = new OrderWithOrderItemsAndDeliverySpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}
