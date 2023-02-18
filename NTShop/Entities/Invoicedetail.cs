using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("INVOICEDETAIL")]
    [Index("Productid", Name = "INVOICEDETAIL2_FK")]
    [Index("Invoiceid", Name = "INVOICEDETAIL_FK")]
    public partial class Invoicedetail
    {
        [Column("INVOICEID")]
        [StringLength(64)]
        public string Invoiceid { get; set; } = null!;
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Key]
        [Column("INVOICEDETAILID")]
        [StringLength(64)]
        public string Invoicedetailid { get; set; } = null!;
        [Column("INVOICEDETAILQUANTITY")]
        public int? Invoicedetailquantity { get; set; }
        [Column("INVOICEDETAILPRICE")]
        public int? Invoicedetailprice { get; set; }

        [ForeignKey("Invoiceid")]
        [InverseProperty("Invoicedetails")]
        public virtual Invoice Invoice { get; set; } = null!;
        [ForeignKey("Productid")]
        [InverseProperty("Invoicedetails")]
        public virtual Product Product { get; set; } = null!;
    }
}
