using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class ProductImageModel
    {
        public string? Productimageid { get; set; } 
        public string Productid { get; set; } = null!;
        public string? Productimageurl { get; set; }
    }
}
