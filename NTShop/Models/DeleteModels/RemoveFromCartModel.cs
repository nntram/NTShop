using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.DeleteModels
{
    public class RemoveFromCartModel
    {
        [StringLength(64)]
        [Required]
        public string CartDetailId { get; set; } = null!;

    }
}
