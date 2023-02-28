using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Repositories
{
    public class CategoryRepositoty : ICategoryRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryRepositoty(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<CategoryModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Category>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<CategoryModel>>(data);
        }
      
        public async Task<CategoryModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Category>().GetFirstOrDefaultAsync(
                        predicate: x => x.Categoryid == id);

            return _mapper.Map<CategoryModel>(data);
        }

    }
}
