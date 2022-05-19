namespace API.Dtos
{
    public class OrderDto
    {
        public int DeliveryMethodId { get; set; }
        public string? BasketId { get; set; }
        public AddressDto? ShipToAddress { get; set; }
    }
}
