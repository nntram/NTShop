using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.AuthModels
{
    public class ResetPasswordModel
    {
        [Required]
        [StringLength(256)]
        public string Password { get; set; } = null!;
    }
}
