using Arch.EntityFrameworkCore.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using NTShop.Data;
using NTShop.Repositories;
using NTShop.Repositories.Interface;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Add My services

builder.Services.AddTransient<IProductRepository, ProductRepositoty>();


//Config database
builder.Services.AddDbContext<NIENLUANContext>(
               x => x.UseSqlServer(builder.Configuration.GetConnectionString("eshop")));

//Add Unitofwork
builder.Services.AddUnitOfWork<NIENLUANContext>();

//Add AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
