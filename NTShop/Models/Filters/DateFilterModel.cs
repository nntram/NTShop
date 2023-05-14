namespace NTShop.Models.Filters
{
    public class DateFilterModel
    {
        public long BeginDate { get; set; } = 0;
        public long EndDate { get; set; } = long.MaxValue;
    }
}
