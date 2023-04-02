using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Entities;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [Route("address")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressRepository _addressRepository;

        public AddressController(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvince()
        {
            var data = await _addressRepository.GetProvinceAsync();
            return Ok(data);
        }

        [HttpGet("districts/{provinceId}")]
        public async Task<IActionResult> GetDistrict(string provinceId)
        {
            var data = await _addressRepository.GetDistrictAsync(provinceId);
            return Ok(data);
        }

        [HttpGet("wards/{districtId}")]
        public async Task<IActionResult> GetWard(string districtId)
        {
            var data = await _addressRepository.GetWardAsync(districtId);
            return Ok(data);
        }
    }
}
