using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Models;

namespace NTShop.Repositories.Interface
{
    public interface IStaffRepository
    {
        public Task<List<StaffModel>> GetAllAsync();
        public Task<StaffModel> GetByIdAsync(string id);
        public Task<AccountModel> GetByUserName(string username);
        public Task<bool> UpdateTokenAsync(AccountModel model);
        public Task<bool> IsUsernameExist(string username);
        public Task<bool> ResetPasswordAsync(AccountModel model);
    }
}
