using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Helpers;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerService _fileManagerService;

        public StaffRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<StaffModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<staff>().GetPagedListAsync(
                        include: p => p.Include(m => m.Role),
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<StaffModel>>(data);
        }

        public async Task<StaffModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<staff>().GetFirstOrDefaultAsync(
                        predicate: x => x.Staffid == id);

            return _mapper.Map<StaffModel>(data);
        }

        public async Task<AccountModel> GetByUserName(string username)
        {
            var data = await _unitOfWork.GetRepository<staff>().GetFirstOrDefaultAsync
                            (predicate: p => p.Staffloginname == username,
                            include: p => p.Include(m => m.Role));

            var account = new AccountModel();
            if (data is null)
            {
                return null;
            }

            account.UserName = data.Staffloginname;
            account.UserId = data.Staffid;
            account.Email = data.Staffemail;
            account.RefreshToken = data.Staffrefreshtoken;
            account.TokenExpiryTime = data.Stafftokenexpirytime;
            account.Password = data.Staffpassword;
            account.DisplayName = data.Staffname;
            account.IsActive = data.Staffisactive;
            account.Role = data.Role.Rolename;

            return (account);
        }

        public async Task<bool> UpdateTokenAsync(AccountModel model)
        {
            var data = await _unitOfWork.GetRepository<staff>().FindAsync(model.UserId);
            if (data is null) return false;

            data.Staffrefreshtoken = model.RefreshToken;
            data.Stafftokenexpirytime = model.TokenExpiryTime;

            try
            {
                _unitOfWork.GetRepository<staff>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> IsUsernameExist(string username)
        {
            var data = await _unitOfWork.GetRepository<staff>().GetFirstOrDefaultAsync(
                predicate: p => p.Staffloginname == username);
            return data != null;
        }


        public async Task<bool> ResetPasswordAsync(AccountModel model)
        {
            var data = await _unitOfWork.GetRepository<staff>().FindAsync(model.UserId);
            if (data is null) return false;

            var password = BC.HashPassword(model.Password);
            data.Staffpassword = password;

            try
            {
                _unitOfWork.GetRepository<staff>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

    }
}
