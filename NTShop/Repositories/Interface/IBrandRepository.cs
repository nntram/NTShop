using NTShop.Models;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;

namespace NTShop.Repositories.Interface
{
    public interface IBrandRepository
    {
        public Task<List<BrandModel>> GetAllAsync();
        public Task<BrandModel> GetByIdAsync(string id);
        public Task<string> Create(BrandCreateModel model);
        public Task<string> Update(BrandUpdateModel model);
        public Task<string> Delete (string id);
    }
}
