using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.AuthModels
{
    public class ResetPasswordModel
    {
        [Required]
        public string Password { get; set; } = null!;
    }
}
