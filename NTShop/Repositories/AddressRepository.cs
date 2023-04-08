using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models.AddressModels;
using NTShop.Repositories.Interface;

namespace NTShop.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AddressRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<DistrictModel>> GetDistrictAsync(string provinceId)
        {
            var data = (await _unitOfWork.GetRepository<District>().GetPagedListAsync(
                          predicate: p => p.Provinceid == provinceId,
                          pageSize: int.MaxValue))
                          .Items;
            return _mapper.Map<List<DistrictModel>>(data);
        }

        public async Task<List<ProvinceModel>> GetProvinceAsync()
        {
            var data = (await _unitOfWork.GetRepository<Province>().GetPagedListAsync(
                           pageSize: int.MaxValue))
                           .Items;
            return _mapper.Map<List<ProvinceModel>>(data);
        }

        public async Task<List<WardModel>> GetWardAsync(string districtId)
        {
            var data = (await _unitOfWork.GetRepository<Ward>().GetPagedListAsync(
                           predicate: p => p.Districtid == districtId,
                           pageSize: int.MaxValue))
                           .Items;
            return _mapper.Map<List<WardModel>>(data);
        }
    }
}
