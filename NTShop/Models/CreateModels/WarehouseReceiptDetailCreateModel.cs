using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class WarehouseReceiptDetailCreateModel
    {
        [Required]
        [StringLength(64)]
        public string Productid { get; set; } 
        [Required]
        public int Wrdetailquatity { get; set; }
        [Required]
        public int Wrdetailprice { get; set; }
        [Required]
        public int Wrdetailsaleprice { get; set; }
    }
}
