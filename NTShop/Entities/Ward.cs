using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("WARD")]
    [Index("Districtid", Name = "WARD_PROVINCE_FK")]
    public partial class Ward
    {
        public Ward()
        {
            Customers = new HashSet<Customer>();
            Suppliers = new HashSet<Supplier>();
        }

        [Key]
        [Column("WARDID")]
        [StringLength(64)]
        public string Wardid { get; set; } = null!;
        [Column("DISTRICTID")]
        [StringLength(64)]
        public string Districtid { get; set; } = null!;
        [Column("WARDNAME")]
        [StringLength(128)]
        public string? Wardname { get; set; }

        [ForeignKey("Districtid")]
        [InverseProperty("Wards")]
        public virtual District District { get; set; } = null!;
        [InverseProperty("Ward")]
        public virtual ICollection<Customer> Customers { get; set; }
        [InverseProperty("Ward")]
        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
