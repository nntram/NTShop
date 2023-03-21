using NTShop.Models;
using NTShop.Models.AuthModel;

namespace NTShop.Repositories.Interface
{
    public interface ICustomerRepository
    {
        public Task<List<CustomerModel>> GetAllAsync();
        public Task<CustomerModel> GetByIdAsync(string id);
        public Task<AccountModel> GetByUserName(string username);
        public Task<bool> UpdateAccountAsync(AccountModel model);
    }

}
