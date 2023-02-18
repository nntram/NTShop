using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("WAREHOUSERECEIPTDETAIL")]
    [Index("Productid", Name = "WAREHOUSERECEIPTDETAIL2_FK")]
    [Index("Warehousereceiptid", Name = "WAREHOUSERECEIPTDETAIL_FK")]
    public partial class Warehousereceiptdetail
    {
        [Column("WAREHOUSERECEIPTID")]
        [StringLength(64)]
        public string Warehousereceiptid { get; set; } = null!;
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Key]
        [Column("WRDETAILID")]
        [StringLength(64)]
        public string Wrdetailid { get; set; } = null!;
        [Column("WRDETAILQUATITY")]
        public int? Wrdetailquatity { get; set; }
        [Column("WRDETAILPRICE")]
        public int? Wrdetailprice { get; set; }

        [ForeignKey("Productid")]
        [InverseProperty("Warehousereceiptdetails")]
        public virtual Product Product { get; set; } = null!;
        [ForeignKey("Warehousereceiptid")]
        [InverseProperty("Warehousereceiptdetails")]
        public virtual Warehousereceipt Warehousereceipt { get; set; } = null!;
    }
}
