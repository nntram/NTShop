using Abp.Extensions;
using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using Castle.Core.Resource;
using Microsoft.AspNetCore.Mvc;
using NTShop.Entities;
using NTShop.Helpers;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerService _fileManagerService;

        public CustomerRepository(IUnitOfWork unitOfWork, IMapper mapper, IFileManagerService fileManagerService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileManagerService = fileManagerService;
        }

        public async Task<List<CustomerModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Customer>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<CustomerModel>>(data);
        }

        public async Task<CustomerModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync(
                        predicate: x => x.Customerid == id);

            return _mapper.Map<CustomerModel>(data);
        }

        public async Task<AccountModel> GetByUserName(string username)
        {
            var data = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync
                            (predicate: p => p.Customerusername == username);

            var account = new AccountModel();
            if (data is null)
            {
                return null;
            }

            account.UserName = data.Customerusername;
            account.UserId = data.Customerid;
            account.Email = data.Customeremail;
            account.Avatar = data.Customeravatar;
            account.RefreshToken = data.Customerrefreshtoken;
            account.TokenExpiryTime = data.Customertokenexpirytime;
            account.Password = data.Customerpassword;
            account.DisplayName = data.Customername;
            account.IsActive = data.Customerisactive;
            account.Role = "Customer";

            return (account);
        }

        public async Task<bool> UpdateTokenAsync(AccountModel model)
        {
            var data = await _unitOfWork.GetRepository<Customer>().FindAsync(model.UserId);
            if (data is null) return false;

            data.Customerrefreshtoken = model.RefreshToken;
            data.Customertokenexpirytime = model.TokenExpiryTime;

            try
            {
                _unitOfWork.GetRepository<Customer>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<string> CreatetAsync(CustomerCreateModel model)
        {

            if (model.Avatar != null && !FileValid.IsImageValid(model.Avatar))
            {
                return "Định dạng file không được chấp nhận.";
            }
            var username = await IsUsernameExist(model.Customerusername);
            if (username)
            {
                return "Tên đăng nhập đã tồn tại.";
            }
            var ward = await _unitOfWork.GetRepository<Ward>().FindAsync(model.Wardid);
            if (ward == null)
            {
                return "Mã xã phường không đúng.";
            }


            var customer = _mapper.Map<Customer>(model);

            var password = BC.HashPassword(model.Customerpassword);
            customer.Customerpassword = password;
            customer.Customeremailconfirm = false;
            customer.Customerisactive = false;
            if (model.Avatar?.Length > 0)
            {
                var upLoadImage = await _fileManagerService.UploadSingleImage(model.Avatar, GetPath.AvatarImage);
                if (upLoadImage.Length > 0)
                {
                    customer.Customeravatar = upLoadImage;
                }

            }

            var result = await _unitOfWork.GetRepository<Customer>().InsertAsync(customer);
            _unitOfWork.SaveChanges();

            return "Ok:" + result.Entity.Customerid;
        }

        public async Task<bool> IsUsernameExist(string username)
        {
            var data = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync(
                predicate: p => p.Customerusername == username);
            return data != null;
        }

        public async Task<bool> ConfirmEmail(string id)
        {
            var data = await _unitOfWork.GetRepository<Customer>().FindAsync(id);
            if (data is null) return false;

            if(data.Customeremailconfirm == true) return false;

            data.Customeremailconfirm = true;
            data.Customerisactive = true;

            try
            {
                _unitOfWork.GetRepository<Customer>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;

        }

        public async Task<AccountModel> GetByEmail(string email)
        {
            var data = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync
                            (predicate: p => p.Customeremail == email);

            var account = new AccountModel();
            if (data is null)
            {
                return null;
            }

            account.UserName = data.Customerusername;
            account.UserId = data.Customerid;
            account.Email = data.Customeremail;
            account.Avatar = data.Customeravatar;
            account.RefreshToken = data.Customerrefreshtoken;
            account.TokenExpiryTime = data.Customertokenexpirytime;
            account.Password = data.Customerpassword;
            account.DisplayName = data.Customername;
            account.IsActive = data.Customerisactive;
            account.Role = "Customer";

            return (account);
        }

        public async Task<bool> ResetPasswordAsync(AccountModel model)
        {
            var data = await _unitOfWork.GetRepository<Customer>().FindAsync(model.UserId);
            if (data is null) return false;

            var password = BC.HashPassword(model.Password);
            data.Customerpassword = password;

            try
            {
                _unitOfWork.GetRepository<Customer>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<string> ChangePasswordAsync([FromBody] ChangePasswordModel model, string userId)
        {
            var data = await _unitOfWork.GetRepository<Customer>().FindAsync(userId);
            if (data is null) return "Không tìm thấy tài khoản.";


            if (!BC.Verify(model.CurrentPassword, data.Customerpassword))
            {
                return "Mật khẩu hiện tại không đúng.";
            }

            var newPassword = BC.HashPassword(model.NewPassword);
            data.Customerpassword = newPassword;

            try
            {
                _unitOfWork.GetRepository<Customer>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch (Exception)
            {
                return "Đã xảy ra lỗi.";
            }

            return "success";
        }

        public async Task<string> UpdateInforAsync(CustomerUpdateModel model, string userId)
        {
            var customer = await _unitOfWork.GetRepository<Customer>().FindAsync(userId);
            if (customer is null) return "Không tìm thấy tài khoản.";

            if (model.Avatar != null && !FileValid.IsImageValid(model.Avatar))
            {
                return "Định dạng file không được chấp nhận.";
            }
            var ward = await _unitOfWork.GetRepository<Ward>().FindAsync(model.Wardid);
            if (ward == null)
            {
                return "Mã xã phường không đúng.";
            }


            _mapper.Map(model, customer);
            try
            {
                if (model.Avatar?.Length > 0)
                {
                    var upLoadImage = await _fileManagerService.UploadSingleImage(model.Avatar, GetPath.AvatarImage);
                    var oldAvatar = customer.Customeravatar;
                    if (upLoadImage.Length > 0)
                    {
                        customer.Customeravatar = upLoadImage;
                    }
                    if(oldAvatar != null)
                    {
                        _fileManagerService.DeleteSingleImage(GetPath.AvatarImage+ "/" +oldAvatar);
                    }

                }

                _unitOfWork.GetRepository<Customer>().Update(customer);
                _unitOfWork.SaveChanges();
                return "success";
            }
            catch (Exception ex)
            {
                return "Đã có lỗi xảy ra";
            }


        }
    }
}
