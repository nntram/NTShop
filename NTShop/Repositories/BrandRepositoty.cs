using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Repositories
{
    public class BrandRepositoty : IBrandRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandRepositoty(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<BrandModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Brand>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<BrandModel>>(data);
        }

        public async Task<BrandModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Brand>().GetFirstOrDefaultAsync(
                        predicate: x => x.Brandid == id);

            return _mapper.Map<BrandModel>(data);
        }

       
    }
}
