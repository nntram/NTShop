using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class OrderDetailModel
    {
        [StringLength(64)]
        public string Orderid { get; set; } = null!;
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [StringLength(64)]
        public string Orderdetailid { get; set; } = null!;
        public int? Orderdetailquantity { get; set; }
        public int? Orderdetailprice { get; set; }
        public ProductModel Product { get; set; }
    }
}
