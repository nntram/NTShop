using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class BrandUpdateModel
    {
        [Required]
        [StringLength(64)]
        public string Brandid { get; set; }
        [Required]
        [StringLength(256)]
        public string Brandname { get; set; }
        public IFormFile? BrandImageFile { get; set; }
    }
}
