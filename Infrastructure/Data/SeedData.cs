using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class SeedData
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory factory)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.ProductBrands.Any())
            {
                var brandData = File.ReadAllText(path + @"/Seed/brands.json");
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandData);

                context.ProductBrands.AddRange(brands);
            }

            if (!context.ProductTypes.Any())
            {
                var typeData = File.ReadAllText(path + @"/Seed/types.json");
                var types = JsonSerializer.Deserialize<List<ProductType>>(typeData);

                context.ProductTypes.AddRange(types);
            }

            if (!context.Products.Any())
            {
                var productData = File.ReadAllText(path + @"/Seed/products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productData);

                context.Products.AddRange(products);
            }

            if (!context.Deliveries.Any())
            {
                var deliveryData = File.ReadAllText(path + @"/Seed/delivery.json");
                var deliveries = JsonSerializer.Deserialize<List<Delivery>>(deliveryData);

                context.Deliveries.AddRange(deliveries);
            }



            await context.SaveChangesAsync();
        }
    }
}
