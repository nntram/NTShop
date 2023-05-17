using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("ORDER")]
    [Index("Customerid", Name = "CUSTOMER_ORDER_FK")]
    [Index("Orderstatusid", Name = "ORDER_STATUS_FK")]
    [Index("Staffid", Name = "STAFF_ORDER_FK")]
    public partial class Order
    {
        public Order()
        {
            Invoices = new HashSet<Invoice>();
            Orderdetails = new HashSet<Orderdetail>();
        }

        [Key]
        [Column("ORDERID")]
        [StringLength(64)]
        public string Orderid { get; set; } = null!;
        [Column("STAFFID")]
        [StringLength(64)]
        public string? Staffid { get; set; }
        [Column("ORDERSTATUSID")]
        [StringLength(64)]
        public string Orderstatusid { get; set; } = null!;
        [Column("CUSTOMERID")]
        [StringLength(64)]
        public string Customerid { get; set; } = null!;
        [Column("ORDERCREATEDDATE")]
        public long? Ordercreateddate { get; set; }
        [Column("ORDERTRACKINGCODE")]
        [StringLength(128)]
        public string? Ordertrackingcode { get; set; }
        [Column("ORDERADRESS")]
        [StringLength(256)]
        public string? Orderadress { get; set; }
        [Column("ORDERSHIPCOST")]
        public int? Ordershipcost { get; set; }
        [Column("ORDERPHONENUMBER")]
        [StringLength(16)]
        public string? Orderphonenumber { get; set; }
        [Column("ORDERISPAID")]
        public bool? Orderispaid { get; set; }
        [Column("ORDERCUSTOMERNAME")]
        [StringLength(128)]
        public string? Ordercustomername { get; set; }
        [Column("ORDERTOTALAMOUNT")]
        public int? Ordertotalamount { get; set; }
        [Column("ORDERCODE")]
        public int Ordercode { get; set; }

        [ForeignKey("Customerid")]
        [InverseProperty("Orders")]
        public virtual Customer Customer { get; set; } = null!;
        [ForeignKey("Orderstatusid")]
        [InverseProperty("Orders")]
        public virtual Orderstatus Orderstatus { get; set; } = null!;
        [ForeignKey("Staffid")]
        [InverseProperty("Orders")]
        public virtual staff? Staff { get; set; }
        [InverseProperty("Order")]
        public virtual ICollection<Invoice> Invoices { get; set; }
        [InverseProperty("Order")]
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
    }
}
