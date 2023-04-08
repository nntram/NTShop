using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class CustomerCreateModel
    {
        [Required]
        [StringLength(64)]
        public string Wardid { get; set; } = null!;
        [Required]
        [StringLength(128)]       
        public string Customername { get; set; } = null!;
        [Required]
        public bool Customergender { get; set; }
        [Required]
        [StringLength(16)]
        public string Customerphonenumber { get; set; } = null!;
        [Required]
        [StringLength(256)]
        public string Customeraddress { get; set; } = null!;
        [Required]
        [StringLength(128)]
        public string Customeremail { get; set; } = null!;
        [Required]
        [StringLength(128)] 
        public string Customerusername { get; set; } = null!;
        [Required]
        [StringLength(256)] 
        public string Customerpassword { get; set; } = null!;
        public IFormFile? Avatar { get; set; }
        [Required]
        public string Token { get; set; } = null!;
    }
}
