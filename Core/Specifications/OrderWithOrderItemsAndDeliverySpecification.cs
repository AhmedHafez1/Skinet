using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class OrderWithOrderItemsAndDeliverySpecification : BaseSpecification<Order>
    {
        public OrderWithOrderItemsAndDeliverySpecification(string email) : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.Delivery);
            SetOrderByDesc(o => o.OrderDate);
        }

        public OrderWithOrderItemsAndDeliverySpecification(string email, int id) : base(o => o.BuyerEmail == email && o.Id == id)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.Delivery);
        }


    }
}
