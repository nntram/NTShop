using AutoMapper;
using NTShop.Entities;
using NTShop.Models;

namespace B1809531_EShop_MVC6.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ProductModels>().ReverseMap();
           

        }
    }
}
