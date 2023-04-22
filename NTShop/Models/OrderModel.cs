using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using NTShop.Entities;

namespace NTShop.Models
{
    public class OrderModel
    {
        [StringLength(64)]
        public string? Orderid { get; set; }
        [StringLength(64)]
        public string? Staffid { get; set; }
        [StringLength(64)]
        public string? Orderstatusid { get; set; }
        [StringLength(64)]
        public string? Customerid { get; set; }
        public long? Ordercreateddate { get; set; }
        [StringLength(128)]
        public string? Ordertrackingcode { get; set; }
        [StringLength(256)]
        public string? Orderadress { get; set; }
        public int? Ordershipcost { get; set; }
        [StringLength(16)]
        public string? Orderphonenumber { get; set; }
        public bool? Orderispaid { get; set; }
        [StringLength(128)]
        public string? Ordercustomername { get; set; }
        public List<OrderDetailModel>? Orderdetails { get; set; }
        [Required]
        public string PaymentType { get; set; } = null!;
    }
}
