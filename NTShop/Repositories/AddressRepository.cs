using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models.AddressModels;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

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

        public async Task<FullAddressModel?> GetFullAddressAsync(string wardId)
        {
            var fullAddress = new FullAddressModel();
            fullAddress.WardId = wardId;

            var data = await _unitOfWork.GetRepository<Ward>().GetFirstOrDefaultAsync(
                predicate: p => p.Wardid == wardId,
                include: p => p.Include(n => n.District).ThenInclude(m => m.Province));
            if(data == null)
            {
                return null;
            }
            fullAddress.DistrictId = data.Districtid;
            fullAddress.ProviceId = data.District.Provinceid;

            fullAddress.Provinces = await GetProvinceAsync();
            fullAddress.Districts = await GetDistrictAsync(fullAddress.ProviceId);
            fullAddress.Wards = await GetWardAsync(fullAddress.DistrictId);

            return fullAddress;
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
