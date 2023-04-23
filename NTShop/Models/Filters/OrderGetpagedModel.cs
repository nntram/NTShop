using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.Filters
{
    public class OrderGetpagedModel : GetPagedModel
    {
        [StringLength(64)]
        public string? Orderstatusid { get; set; }
        public bool? Orderispaid { get; set; }
    }
}
