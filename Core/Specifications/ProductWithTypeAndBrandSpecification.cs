using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductWithTypeAndBrandSpecification : BaseSpecification<Product>
    {
        public ProductWithTypeAndBrandSpecification(string sort)
        {
            AddInclude(p => p.ProductType);
            AddInclude(p => p.ProductBrand);
            SetOrderBy(p => p.Name);

            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort)
                {
                    case "priceAsc":
                        SetOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        SetOrderByDesc(p => p.Price);
                        break;
                    default:
                        SetOrderBy(p => p.Name);
                        break;
                }
            }
        }

        public ProductWithTypeAndBrandSpecification(int id) : base(p => p.Id == id)
        {
            AddInclude(p => p.ProductType);
            AddInclude(p => p.ProductBrand);
        }
    }
}
