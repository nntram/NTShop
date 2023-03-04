namespace NTShop.Models.Filters
{
    public class GetPagedModel
    {
        public int PageSize { get; set; } = int.MaxValue;
        public int PageIndex { get; set; } = 0;
    }
}
