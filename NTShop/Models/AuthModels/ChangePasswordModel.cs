using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.AuthModels
{
    public class ChangePasswordModel
    {
        [Required]
        [StringLength(256)]
        public string CurrentPassword { get; set; } = null!;
        [Required]
        [StringLength(256)]
        public string NewPassword { get; set; } = null!;
    }
}
