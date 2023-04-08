using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Repositories.Interface;

namespace NTShop.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CustomerRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
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

        public async Task<CustomerCreateModel> CreatetAsync(CustomerCreateModel model)
        {
            return model;
        }
    }
}
