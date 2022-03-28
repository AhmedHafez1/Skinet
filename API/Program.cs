using API;
using API.Errors;
using API.Helpers;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<StoreContext>(optionBuilder =>
    optionBuilder.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.ConfigureDb();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddControllers();

// To Override Api Validation Errors response for ApiControllers
builder.Services.Configure<ApiBehaviorOptions>(options =>
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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    try
    {
        await context.Database.MigrateAsync();
        await SeedData.SeedAsync(context, loggerFactory);
    }
    catch (Exception ex)
    {

        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An Error Occured During Migration");
    }
}

// Configure the HTTP request pipeline.

// For Server Error Exceptions
app.UseMiddleware<ExceptionMiddleware>();

// For 404 Not Found controllers
app.UseStatusCodePagesWithReExecute("/error/{0}");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();



app.Run();
