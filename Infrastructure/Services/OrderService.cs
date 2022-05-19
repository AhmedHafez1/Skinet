using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
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
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<Delivery> _deliveryRepo;
        private readonly IGenericRepository<Order> _orderRepo;

        public OrderService(IBasketRepository basketRepo, IGenericRepository<Product> productRepo, IGenericRepository<Delivery> deliveryRepo, IGenericRepository<Order> orderRepo)
        {
            _basketRepo = basketRepo;
            _productRepo = productRepo;
            _deliveryRepo = deliveryRepo;
            _orderRepo = orderRepo;
        }



        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress)
        {
            // Get Basket from Basket Repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // Get Product Items from Product Repo
            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.Id);

                var orderItem = new OrderItem(new ProductItemOrdered(product.Id, product.Name, product.PictureUrl), product.Price, item.Quantity);

                items.Add(orderItem);
            }

            // Get Delivery Method from Delivery Repo
            var delivery = await _deliveryRepo.GetByIdAsync(deliveryMethod);

            // Calc SubTotal
            var subTotal = items.Sum(item => item.Quantity * item.Price);

            // Create Order
            var order = new Order(items, buyerEmail, shippingAddress, delivery, subTotal);

            // Save To Db

            // Return Order
            return order;
        }

        public Task<IReadOnlyList<Delivery>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Order> GetOrderByIdAsync(int orderId, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}
