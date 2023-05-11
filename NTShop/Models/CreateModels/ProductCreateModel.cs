using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class ProductCreateModel
    {
        [Required]
        public string Categoryid { get; set; } = null!;
        [Required]
        public string Brandid { get; set; } = null!;
        [Required]
        public string Productname { get; set; }
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
        public IFormFile[] ProductImageFiles { get; set; }
    }
}
