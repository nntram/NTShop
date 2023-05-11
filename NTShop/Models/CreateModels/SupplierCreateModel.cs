using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class SupplierCreateModel
    {
        [Required] 
        [StringLength(64)]
        public string Wardid { get; set; } = null!;
        [Required]
        [StringLength(256)]
        public string Suppliername { get; set; }
        [Required]
        [StringLength(256)]
        public string Supplieremail { get; set; }
        [Required]
        [StringLength(16)]
        public string Supplierphonenumber { get; set; }
        [StringLength(256)]
        [Required]
        public string Supplieraddress { get; set; }
    }
}
