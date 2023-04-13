using Abp.Extensions;
using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NTShop.Entities;
using NTShop.Helpers;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerServies _fileManagerService;

        public CustomerRepository(IUnitOfWork unitOfWork, IMapper mapper, IFileManagerServies fileManagerService)
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

        public async Task<bool> UpdateAccountAsync(AccountModel model)
        {
            var data = await _unitOfWork.GetRepository<Customer>().FindAsync(model.UserId);
            if(data is null) return false;

            data.Customerrefreshtoken = model.RefreshToken;
            data.Customertokenexpirytime = model.TokenExpiryTime;
            data.Customerpassword = model.Password;
            data.Customerisactive= model.IsActive;

            try
            {
                _unitOfWork.GetRepository<Customer>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch(Exception)
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
            if(ward == null)
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

            await _unitOfWork.GetRepository<Customer>().InsertAsync(customer);
            _unitOfWork.SaveChanges();

            return "Ok";
        }

        public async Task<bool> IsUsernameExist(string username)
        {
            var data = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync(
                predicate: p => p.Customerusername == username);
            return data != null;
        }
    }
}
