using Core.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class SeedData
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory factory)
        {
            if (!context.ProductBrands.Any())
            {
                var brandData = File.ReadAllText("../Infrastructure/Seed/brands.json");
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandData);

                context.ProductBrands.AddRange(brands);
            }

            if (!context.ProductTypes.Any())
            {
                var typeData = File.ReadAllText("../Infrastructure/Seed/types.json");
                var types = JsonSerializer.Deserialize<List<ProductType>>(typeData);

                context.ProductTypes.AddRange(types);
            }

            if (!context.Products.Any())
            {
                var productData = File.ReadAllText("../Infrastructure/Seed/products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productData);

                context.Products.AddRange(products);
            }

            await context.SaveChangesAsync();
        }
    }
}
