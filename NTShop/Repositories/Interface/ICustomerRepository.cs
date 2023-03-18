using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface ICustomerRepository
    {
        public Task<List<CustomerModel>> GetAllAsync();
        public Task<CustomerModel> GetByIdAsync(string id);
        public Task<CustomerModel> GetByUserName(string username);
    }

}
