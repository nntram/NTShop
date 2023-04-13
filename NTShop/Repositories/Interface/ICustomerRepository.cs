using Microsoft.AspNetCore.Mvc;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;

namespace NTShop.Repositories.Interface
{
    public interface ICustomerRepository
    {
        public Task<List<CustomerModel>> GetAllAsync();
        public Task<CustomerModel> GetByIdAsync(string id);
        public Task<AccountModel> GetByUserName(string username);
        public Task<bool> UpdateAccountAsync(AccountModel model);
        public Task<string> CreatetAsync(CustomerCreateModel model);
        public Task<bool> IsUsernameExist(string username);
    }

}
