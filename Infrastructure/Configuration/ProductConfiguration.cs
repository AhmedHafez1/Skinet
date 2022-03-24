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
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.PictureUrl).IsRequired();
            builder.Property("Price").HasColumnType("decimal(18,2)").IsRequired();
            builder.HasOne(p => p.ProductBrand).WithMany().HasForeignKey(p => p.ProductBrandId);
            builder.HasOne(p => p.ProductType).WithMany().HasForeignKey(p => p.ProductTypeId);
        }

    }
}
