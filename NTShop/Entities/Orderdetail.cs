using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("ORDERDETAIL")]
    [Index("Productid", Name = "ORDERDETAIL2_FK")]
    [Index("Orderid", Name = "ORDERDETAIL_FK")]
    public partial class Orderdetail
    {
        [Column("ORDERID")]
        [StringLength(64)]
        public string Orderid { get; set; } = null!;
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Key]
        [Column("ORDERDETAILID")]
        [StringLength(64)]
        public string Orderdetailid { get; set; } = null!;
        [Column("ORDERDETAILQUANTITY")]
        public int? Orderdetailquantity { get; set; }
        [Column("ORDERDETAILPRICE")]
        public int? Orderdetailprice { get; set; }

        [ForeignKey("Orderid")]
        [InverseProperty("Orderdetails")]
        public virtual Order Order { get; set; } = null!;
        [ForeignKey("Productid")]
        [InverseProperty("Orderdetails")]
        public virtual Product Product { get; set; } = null!;
    }
}
