using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configuration
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasData(
                new Product()
                {
                    Id = 1,
                    Name = "IT_Solutions Product ",
                },
                new Product()
                {
                    Id = 2,
                    Name = "Admin_Solutions Product",
                },
                new Product()
                {
                    Id = 3,
                    Name = "Football Product",
                }
                );
        }

    }
}
