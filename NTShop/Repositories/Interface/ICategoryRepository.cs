using NTShop.Models;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;

namespace NTShop.Repositories.Interface
{
    public interface ICategoryRepository
    {
        public Task<List<CategoryModel>> GetAllAsync();
        public Task<CategoryModel> GetByIdAsync(string id);
        public Task<string> Create(CategoryCreateModel model);
        public Task<string> Update(CategoryUpdateModel model);
        public Task<string> Delete(string id);
    }
}
