using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;

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

        public async Task<List<ProductModels>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                        pageSize: 10)).Items;

            return _mapper.Map<List<ProductModels>>(data);
        }

        public async Task<ProductModels> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: x => x.Productid == id);

            return _mapper.Map<ProductModels>(data);
        }
    }
}
