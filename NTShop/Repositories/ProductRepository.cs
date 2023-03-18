using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.Filters;
using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using Abp.Linq.Expressions;

namespace NTShop.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<ProductModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                        pageSize: int.MaxValue,
                        predicate: p => p.Productisacitve == true,
                        include: source => source.Include(m => m.Productimages)
                                                   .Include(m => m.Brand)
                                                   .Include(m => m.Category))).Items;

            return _mapper.Map<List<ProductModel>>(data);
        }

        public async Task<ProductModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: x => x.Productid == id && x.Productisacitve == true,
                        include: source => source.Include(m => m.Productimages)
                                                  .Include(m => m.Brand)
                                                  .Include(m => m.Category));

            return _mapper.Map<ProductModel>(data);
        }

        public async Task<PagedList<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter)
        {
            var predicate = PredicateBuilder.New<Product>(p => p.Productisacitve == filter.Productisacitve);
            if (!string.IsNullOrEmpty(filter.Productid))
            {
                predicate = predicate.And(p => p.Productid == filter.Productid);
            }
            if (!string.IsNullOrEmpty(filter.Brandid))
            {
                predicate = predicate.And(p => p.Brandid == filter.Brandid);
            }
            if (!string.IsNullOrEmpty(filter.Categoryid))
            {
                predicate = predicate.And(p => p.Categoryid == filter.Categoryid);
            }
            if (!string.IsNullOrEmpty(filter.Productname))
            {
                predicate = predicate.And(p => 
                    p.Productname.ToLower().Contains(filter.Productname.ToLower()));
            }
            var pages = await _unitOfWork.GetRepository<Product>().GetPagedListAsync(

                     pageSize: filter.PageSize,
                     pageIndex: filter.PageIndex,
                     include: source => source.Include(m => m.Productimages)
                                                  .Include(m => m.Brand)
                                                  .Include(m => m.Category),
                     predicate: predicate,
                     orderBy: p =>
                        (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "ascending") ?
                            p.OrderBy(s => s.Productsaleprice) :
                         (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "descending") ?
                            p.OrderByDescending(s => s.Productsaleprice) :
                        (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "lastest") ?
                            p.OrderByDescending(s => s.Productcreateddate) :
                         p.OrderBy(s => s.Productid)

                   );


            var result = _mapper.Map<PagedList<ProductCardModel>>(pages);
            return result;
        }

        
    }

    
}
