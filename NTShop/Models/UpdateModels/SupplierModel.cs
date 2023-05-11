using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.UpdateModels
{
    public class SupplierUpdateModel
    {
        [StringLength(64)]
        [Required]
        public string Supplierid { get; set; } = null!;
        [StringLength(64)]
        [Required]
        public string Wardid { get; set; } = null!;
        [StringLength(256)]
        [Required]
        public string? Suppliername { get; set; }
        [StringLength(256)]
        [Required]
        public string? Supplieremail { get; set; }
        [StringLength(16)]
        [Required]
        public string? Supplierphonenumber { get; set; }
        [StringLength(256)]
        [Required]
        public string? Supplieraddress { get; set; }

    }
}
