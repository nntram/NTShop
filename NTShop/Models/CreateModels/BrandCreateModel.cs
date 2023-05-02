using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class BrandCreateModel
    {
        [Required]
        [StringLength(256)]
        public string Brandname { get; set; }
        [Required]
        public IFormFile BrandImageFile { get; set; }
    }
}
