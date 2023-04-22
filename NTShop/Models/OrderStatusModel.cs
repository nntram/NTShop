using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class OrderStatusModel
    {
        public string Orderstatusid { get; set; } = null!;
        public string? Orderstatusname { get; set; }
    }
}
