using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface IBrandRepository
    {
        public Task<List<BrandModel>> GetAllAsync();
        public Task<BrandModel> GetByIdAsync(string id);

    }
}
