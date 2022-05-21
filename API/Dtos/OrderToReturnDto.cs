using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public IReadOnlyList<OrderItemDto>? OrderItems { get; set; }
        public string? BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public Address? ShipToAddress { get; set; }
        public string? Delivery { get; set; }
        public decimal ShippingPrice { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }
        public string? OrderStatus { get; set; }
    }
}
