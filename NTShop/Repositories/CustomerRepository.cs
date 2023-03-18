using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
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

        public async Task<CustomerModel> GetByUserName(string username)
        {
            var account = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync
                            (predicate: p => p.Customerusername == username);

            return _mapper.Map<CustomerModel>(account);
        }
    }
}
