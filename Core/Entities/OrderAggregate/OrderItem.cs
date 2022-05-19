using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrdered? productOrdered, decimal price, int quantity)
        {
            ProductOrdered = productOrdered;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrdered? ProductOrdered { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
