using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class OrderStatusUpdateModel
    {
        [StringLength(64)]
        public string OrderStatusId { get; set; } = null!;
        [StringLength(64)]
        public string OrderId { get; set; } = null!;

        [StringLength(64)]
        public string? StaffId { get; set; }
    }
}
