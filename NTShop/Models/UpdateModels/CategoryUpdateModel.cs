using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class CategoryUpdateModel
    {
        [Required]
        [StringLength(64)]
        public string Categoryid { get; set; }
        [Required]
        [StringLength(256)]
        public string Categoryname { get; set; }
        public IFormFile? CategoryImageFile { get; set; }
    }
}
