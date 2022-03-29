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
        public ProductWithTypeAndBrandSpecification(ProductSpecParams specParams) : base(p =>
            (string.IsNullOrEmpty(specParams.Search) || p.Name.ToLower().Contains(specParams.Search)) &&
            (!specParams.TypeId.HasValue || p.ProductTypeId == specParams.TypeId) &&
            (!specParams.BrandId.HasValue || p.ProductBrandId == specParams.BrandId)
            )
        {
            AddInclude(p => p.ProductType);
            AddInclude(p => p.ProductBrand);
            SetOrderBy(p => p.Name);

            ApplyPaging(specParams.PageSize, specParams.PageSize * (specParams.PageIndex - 1));

            if (!string.IsNullOrEmpty(specParams.Sort))
            {
                switch (specParams.Sort)
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
