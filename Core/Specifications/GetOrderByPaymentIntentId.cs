using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class GetOrderByPaymentIntentId : BaseSpecification<Order>
    {
        public GetOrderByPaymentIntentId(string paymentIntentId) : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}
