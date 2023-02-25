using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface IProductRepository
    {
        public Task<List<ProductModel>> GetAllAsync();
        public Task<ProductModel> GetByIdAsync(string id);

        public Task<List<ProductCardModel>> GetAllCardAsync();
        public Task<List<ProductCardModel>> GetCardAsync(int size);
    }
}
