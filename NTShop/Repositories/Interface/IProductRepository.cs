using NTShop.Models;
using NTShop.Models.Filters;

namespace NTShop.Repositories.Interface
{
    public interface IProductRepository
    {
        public Task<List<ProductModel>> GetAllAsync();
        public Task<ProductModel> GetByIdAsync(string id);

        public Task<List<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter);
        public int GetCount(ProductFilterModel filter);
    }
}
