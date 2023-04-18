using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class CartDetailModel
    {
        [StringLength(64)]
        public string Cartdetailid { get; set; } = null!;
        [StringLength(64)]
        public string Cartid { get; set; } = null!;
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        public int? Cartdetailquantity { get; set; }
        public int? Cartdetailprice { get; set; }
        public ProductModel Product { get; set; } = null!;

    }
}
