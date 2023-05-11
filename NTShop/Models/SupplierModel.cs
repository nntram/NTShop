using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class SupplierModel
    {
        [StringLength(64)]
        public string Supplierid { get; set; } = null!;
        [StringLength(64)]
        public string Wardid { get; set; } = null!;
        [StringLength(256)]
        public string? Suppliername { get; set; }
        [StringLength(256)]
        public string? Supplieremail { get; set; }
        [StringLength(16)]
        public string? Supplierphonenumber { get; set; }
        [StringLength(256)]
        public string? Supplieraddress { get; set; }
        public long? Suppliercreacteddate { get; set; }

    }
}
