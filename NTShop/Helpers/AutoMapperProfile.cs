using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;

namespace B1809531_EShop_MVC6.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ProductModel>()
                .ForMember(t => t.Categoryname, opt => opt.MapFrom(t => t.Category.Categoryname))
                .ForMember(t => t.Brandname, opt => opt.MapFrom(t => t.Brand.Brandname));
            CreateMap<Productimage, ProductImageModel>().ReverseMap();
            CreateMap<Product, ProductCardModel>()
                .ForMember(t => t.Categoryname, opt => opt.MapFrom(t => t.Category.Categoryname))
                .ForMember(t => t.Brandname, opt => opt.MapFrom(t => t.Brand.Brandname))
                .ForMember(t => t.Productimages, opt => opt.MapFrom(t => t.Productimages.First().Productimageurl));

            CreateMap<Brand, BrandModel>();
            CreateMap<Category, CategoryModel>();

            CreateMap<IPagedList<Product>, PagedList<ProductCardModel>>();
        }
    }
}
