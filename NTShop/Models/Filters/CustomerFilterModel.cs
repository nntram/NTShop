namespace NTShop.Models.Filters
{
    public class CustomerFilterModel : GetPagedModel
    {
        public string? SearchValue { get; set; }
    }
}
