using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface IProductRepository
    {
        public Task<List<ProductModels>> GetAllAsync();
        public Task<ProductModels> GetByIdAsync(string id);
    }
}
