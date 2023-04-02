using NTShop.Models;
using NTShop.Models.AddressModel;

namespace NTShop.Repositories.Interface
{
    public interface IAddressRepository
    {
        public Task<List<ProvinceModel>> GetProvinceAsync();
        public Task<List<DistrictModel>> GetDistrictAsync(string provinceId);
        public Task<List<WardModel>> GetWardAsync(string districtId);

    }
}
