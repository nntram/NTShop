using NTShop.Models.CreateModels;
using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface IWarehouseReceiptRepository
    {
        public Task<List<WarehouseReceiptModel>> GetAllAsync();
        public Task<WarehouseReceiptModel> GetByIdAsync(string id);
        public Task<string> Create(WarehouseReceiptCreateModel model);
    }
}
