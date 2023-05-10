using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class ProductUpdateModel
    {
        [Required]
        public string Productid { get; set; } = null!;
        [Required]
        public string Categoryid { get; set; } = null!;
        [Required]
        public string Brandid { get; set; } = null!;
        public string? Productname { get; set; }
        [Required]
        public string? Productdescribe { get; set; }
        [Required]
        public int Productprice { get; set; }
        [Required]
        public int Productsaleprice { get; set; }
        [Required]
        public int Productquantity { get; set; }
        [Required]
        public bool Productisactive { get; set; }
        [Required]
        public bool Productishot { get; set; }
        [Required]
        public List<IFormFile> ProductImageFiles { get; set; }
    }
}
