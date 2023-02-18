using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("DISTRICT")]
    [Index("Provinceid", Name = "PROVINCE_DISTRICT_FK")]
    public partial class District
    {
        public District()
        {
            Wards = new HashSet<Ward>();
        }

        [Key]
        [Column("DISTRICTID")]
        [StringLength(64)]
        public string Districtid { get; set; } = null!;
        [Column("PROVINCEID")]
        [StringLength(64)]
        public string Provinceid { get; set; } = null!;
        [Column("DISTRICTNAME")]
        [StringLength(128)]
        public string? Districtname { get; set; }

        [ForeignKey("Provinceid")]
        [InverseProperty("Districts")]
        public virtual Province Province { get; set; } = null!;
        [InverseProperty("District")]
        public virtual ICollection<Ward> Wards { get; set; }
    }
}
