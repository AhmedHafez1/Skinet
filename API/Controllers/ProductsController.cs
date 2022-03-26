
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductBrand> _brandRepo;
        private readonly IGenericRepository<ProductType> _typeRepo;

        public ProductsController(IGenericRepository<Product> productRepo, IGenericRepository<ProductBrand> brandRepo, IGenericRepository<ProductType> typeRepo)
        {
            _productRepo = productRepo;
            _brandRepo = brandRepo;
            _typeRepo = typeRepo;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var spec = new ProductWithTypeAndBrandSpecification();
            var Products = await _productRepo.ListAsync(spec);

            return Ok(Products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            return await _productRepo.GetEntityWithSpec(spec);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var ProductBrands = await _brandRepo.ListAllAsync();

            return Ok(ProductBrands);
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var ProductTypes = await _typeRepo.ListAllAsync();

            return Ok(ProductTypes);
        }
    }
}