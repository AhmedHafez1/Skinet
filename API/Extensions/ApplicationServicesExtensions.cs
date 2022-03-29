using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
 
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));


            // To Override Api Validation Errors response for ApiControllers
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                    .Where(entry => entry.Value?.Errors.Count() > 0)
                    .SelectMany(ent => ent.Value?.Errors)
                    .Select(err => err.ErrorMessage);

                    var errorResponse = new ApiValidationErrorResponse { Errors = errors };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}
