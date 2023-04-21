using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CheckoutModels
{
    public class PaymentModel
    {
        [Required]
        public string OrderId { get; set; } = null!;
        [Required]
        public int OrderTotalPrice { get; set; }

    }
}
