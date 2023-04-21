using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.AddressModels;
using NTShop.Models.CreateModels;

namespace NTShop.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ProductModel>()
                .ForMember(t => t.Categoryname, opt => opt.MapFrom(t => t.Category.Categoryname))
                .ForMember(t => t.Brandname, opt => opt.MapFrom(t => t.Brand.Brandname));
            CreateMap<Productimage, ProductImageModel>();
            CreateMap<Product, ProductCardModel>()
                .ForMember(t => t.Categoryname, opt => opt.MapFrom(t => t.Category.Categoryname))
                .ForMember(t => t.Brandname, opt => opt.MapFrom(t => t.Brand.Brandname))
                .ForMember(t => t.Productimages, opt => opt.MapFrom(t => t.Productimages.First().Productimageurl));

            CreateMap<Brand, BrandModel>().ReverseMap();
            CreateMap<Category, CategoryModel>().ReverseMap();
            CreateMap<Customer, CustomerModel>().ReverseMap();
            CreateMap<Customer, CustomerCreateModel>().ReverseMap();
            CreateMap<IPagedList<Product>, PagedList<ProductCardModel>>();

            CreateMap<Province, ProvinceModel>().ReverseMap();
            CreateMap<District, DistrictModel>().ReverseMap();
            CreateMap<Ward, WardModel>().ReverseMap();

            CreateMap<Cart, CartModel>().ReverseMap();
            CreateMap<Cartdetail, CartDetailModel>().ReverseMap();
            CreateMap<Order, OrderModel>().ReverseMap();
            CreateMap<Orderdetail, OrderDetailModel>().ReverseMap();

        }
    }
}
