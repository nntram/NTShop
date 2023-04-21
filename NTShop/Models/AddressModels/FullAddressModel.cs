namespace NTShop.Models.AddressModels
{
    public class FullAddressModel
    { 
        public string? ProvinceId { get; set; }
        public string? DistrictId { get; set; }
        public string? WardId { get; set; }
        public List<ProvinceModel> Provinces { get; set; }
        public List<DistrictModel> Districts { get; set; }
        public List<WardModel> Wards { get; set; }
    }
}
