using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams specParams) : base(p =>
              (string.IsNullOrEmpty(specParams.Search) || p.Name.ToLower().Contains(specParams.Search)) &&
              (!specParams.TypeId.HasValue || p.ProductTypeId == specParams.TypeId) &&
              (!specParams.BrandId.HasValue || p.ProductBrandId == specParams.BrandId)
            )
        { }
    }
}
