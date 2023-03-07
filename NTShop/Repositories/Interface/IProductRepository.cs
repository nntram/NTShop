using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.Filters;

namespace NTShop.Repositories.Interface
{
    public interface IProductRepository
    {
        public Task<List<ProductModel>> GetAllAsync();
        public Task<ProductModel> GetByIdAsync(string id);

        public Task<PagedList<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter);
    }
}
