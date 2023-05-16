using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class CustomerUpdateStatusModel
    {
        [Required]
        public string Customerid { get; set; }
        [Required]
        public bool Status { get; set; }
    }
}
