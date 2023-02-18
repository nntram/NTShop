using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("PROVINCE")]
    public partial class Province
    {
        public Province()
        {
            Districts = new HashSet<District>();
        }

        [Key]
        [Column("PROVINCEID")]
        [StringLength(64)]
        public string Provinceid { get; set; } = null!;
        [Column("PROVINCENAME")]
        [StringLength(128)]
        public string? Provincename { get; set; }

        [InverseProperty("Province")]
        public virtual ICollection<District> Districts { get; set; }
    }
}
