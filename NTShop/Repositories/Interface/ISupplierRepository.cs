using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface ISupplierRepository
    {
        public Task<List<SupplierModel>> GetAllAsync();
        public Task<SupplierModel> GetByIdAsync(string id);
        public Task<string> Create(SupplierCreateModel model);
        public Task<string> Update(SupplierUpdateModel model);
        public Task<string> Delete(string id);
    }
}
