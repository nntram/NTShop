using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class AddToCartModel
    {
        [StringLength(64)]
        [Required]
        public string ProductId { get; set; } = null!;
        [Required]
        public int Quantity { get; set; }
    }
}
