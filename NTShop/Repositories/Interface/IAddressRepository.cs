﻿using NTShop.Models;
using NTShop.Models.AddressModels;

namespace NTShop.Repositories.Interface
{
    public interface IAddressRepository
    {
        public Task<List<ProvinceModel>> GetProvinceAsync();
        public Task<List<DistrictModel>> GetDistrictAsync(string provinceId);
        public Task<List<WardModel>> GetWardAsync(string districtId);
        public Task<FullAddressModel?> GetFullAddressAsync(string wardId);

    }
}
