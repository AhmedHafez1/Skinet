using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address shipToAddress, Delivery delivery, decimal subTotal, string paymentIntentId)
        {
            OrderItems = orderItems;
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            Delivery = delivery;
            SubTotal = subTotal;
            PaymentIntentId = paymentIntentId;
        }

        public IReadOnlyList<OrderItem>? OrderItems { get; set; }

        public string? BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address? ShipToAddress { get; set; }
        public Delivery? Delivery { get; set; }
        public decimal SubTotal { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public string? PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return SubTotal + Delivery.Price;
        }
    }
}
