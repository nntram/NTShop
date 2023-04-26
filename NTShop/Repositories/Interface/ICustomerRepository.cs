using Microsoft.AspNetCore.Mvc;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;

namespace NTShop.Repositories.Interface
{
    public interface ICustomerRepository
    {
        public Task<List<CustomerModel>> GetAllAsync();
        public Task<CustomerModel> GetByIdAsync(string id);
        public Task<AccountModel> GetByUserName(string username);
        public Task<AccountModel> GetByEmail(string email);
        public Task<bool> UpdateTokenAsync(AccountModel model);
        public Task<string> CreatetAsync(CustomerCreateModel model);
        public Task<bool> IsUsernameExist(string username);
        public Task<bool> ConfirmEmail(string id);
        public Task<bool> ResetPasswordAsync(AccountModel model);
        public Task<string> ChangePasswordAsync(ChangePasswordModel model, string userId);
        public Task<string> UpdateInforAsync(CustomerUpdateModel model, string userId);
    }

}
