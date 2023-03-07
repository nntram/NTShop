using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.Filters;

namespace NTShop.Repositories
{
    public class ProductRepositoty : IProductRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductRepositoty(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<ProductModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                        pageSize: int.MaxValue, 
                        predicate: p => p.Productinacitve == true,
                        include: source => source.Include(m => m.Productimages)
                                                   .Include(m => m.Brand)
                                                   .Include(m => m.Category))).Items;

            return _mapper.Map<List<ProductModel>>(data);
        }

        public async Task<ProductModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: x => x.Productid == id && x.Productinacitve == true);

            return _mapper.Map<ProductModel>(data);
        }

        public async Task<List<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter)
        {
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                       pageSize: filter.PageSize,
                       pageIndex: filter.PageIndex,
                       predicate: p => p.Productinacitve == true,
                       include: source => source.Include(m => m.Productimages)
                                                  .Include(m => m.Brand)
                                                  .Include(m => m.Category))).Items;
            if(filter != null)
            {
                if(filter.Productishot == true)
                {
                    data = data.Where(n => n.Productishot == true).ToList();
                }
                if (!String.IsNullOrEmpty(filter.Categoryid))
                {
                    data = data.Where(n => n.Categoryid == filter.Categoryid).ToList();
                }
                if (!String.IsNullOrEmpty(filter.Brandid))
                {
                    data = data.Where(n => n.Brandid == filter.Brandid).ToList();
                }
                if (!String.IsNullOrEmpty(filter.OrderBy))
                {
                    switch (filter.OrderBy)
                    {
                        case "ascending":
                            data = data.OrderBy(n => n.Productsaleprice).ToList();
                            break;
                        case "descending":
                            data = data.OrderByDescending(n => n.Productsaleprice).ToList();
                            break;
                        case "lastest":
                            data = data.OrderByDescending(n => n.Productcreateddate).ToList();
                            break;
                    }
                }
            }

            return _mapper.Map<List<ProductCardModel>>(data);
        }

        public async Task<int> GetCount(ProductFilterModel filter)
        {
            int count = 0;
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                      pageSize: filter.PageSize,
                      pageIndex: filter.PageIndex,
                      predicate: p => p.Productinacitve == true,
                      include: source => source.Include(m => m.Productimages)
                                                 .Include(m => m.Brand)
                                                 .Include(m => m.Category))).Items;
            if (filter != null)
            {
                if (filter.Productishot == true)
                {
                    data = data.Where(n => n.Productishot == true).ToList();
                }
            }

            if(data != null)
            {
                count = data.Count;
            }

            return count;
        }
    }
}
