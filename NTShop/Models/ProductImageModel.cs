using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class ProductImageModel
    {
        [StringLength(64)]
        public string? Productimageid { get; set; } 
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        public string? Productimageurl { get; set; }
    }
}
