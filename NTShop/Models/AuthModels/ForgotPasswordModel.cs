using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.AuthModels
{
    public class ForgotPasswordModel
    {
        [Required]
        public string Username { get; set; } = null!;
    }
}
