using Core.Entities;
using Core.Entities.OrderAggregate;
using Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {

        }

        public DbSet<Product>? Products { get; set; }

        public DbSet<ProductType>? ProductTypes { get; set; }

        public DbSet<ProductBrand>? ProductBrands { get; set; }

        public DbSet<Order>? Orders { get; set; }

        public DbSet<OrderItem>? OrderItems { get; set; }

        public DbSet<Delivery>? Deliveries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new ProductConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new OrderItemConfiguration());
        }



    }
}
