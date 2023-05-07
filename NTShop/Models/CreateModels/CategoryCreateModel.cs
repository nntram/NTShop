using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class CategoryCreateModel
    {
        [Required]
        [StringLength(256)]
        public string Categoryname { get; set; }
        [Required]
        public IFormFile CategoryImageFile { get; set; }
    }
}
