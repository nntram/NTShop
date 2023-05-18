using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class WarehouseReceiptDetailModel
    {
        [StringLength(64)]
        public string Warehousereceiptid { get; set; } = null!;
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [StringLength(64)]
        public string Wrdetailid { get; set; } = null!;
        public int? Wrdetailquatity { get; set; }
        public int? Wrdetailprice { get; set; }     
        public int? Wrdetailsaleprice { get; set; }
        public ProductModel? Product { get; set; }
    }
}
