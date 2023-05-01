using NTShop.Models;
using NTShop.Models.CreateModels;

namespace NTShop.Repositories.Interface
{
    public interface IBrandRepository
    {
        public Task<List<BrandModel>> GetAllAsync();
        public Task<BrandModel> GetByIdAsync(string id);
        public Task<string> Create(BrandCreateModel model);
    }
}
