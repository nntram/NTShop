using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface ICategoryRepository
    {
        public Task<List<CategoryModel>> GetAllAsync();
        public Task<CategoryModel> GetByIdAsync(string id);
    }
}
