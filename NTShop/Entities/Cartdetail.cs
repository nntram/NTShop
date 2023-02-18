using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("CARTDETAIL")]
    [Index("Productid", Name = "CARTDETAIL2_FK")]
    [Index("Cartid", Name = "CARTDETAIL_FK")]
    public partial class Cartdetail
    {
        [Column("CARTID")]
        [StringLength(64)]
        public string Cartid { get; set; } = null!;
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Key]
        [Column("CARTDETAILID")]
        [StringLength(64)]
        public string Cartdetailid { get; set; } = null!;
        [Column("CARTDETAILQUANTITY")]
        public int? Cartdetailquantity { get; set; }
        [Column("CARTDETAILPRICE")]
        public int? Cartdetailprice { get; set; }

        [ForeignKey("Cartid")]
        [InverseProperty("Cartdetails")]
        public virtual Cart Cart { get; set; } = null!;
        [ForeignKey("Productid")]
        [InverseProperty("Cartdetails")]
        public virtual Product Product { get; set; } = null!;
    }
}
