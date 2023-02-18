using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("INVOICE")]
    [Index("Customerid", Name = "CUSTOMER_INVOICE_FK")]
    [Index("Orderid", Name = "ORDER_INVOICE_FK")]
    [Index("Staffid", Name = "STAFF_INVOICE_FK")]
    public partial class Invoice
    {
        public Invoice()
        {
            Invoicedetails = new HashSet<Invoicedetail>();
        }

        [Key]
        [Column("INVOICEID")]
        [StringLength(64)]
        public string Invoiceid { get; set; } = null!;
        [Column("STAFFID")]
        [StringLength(64)]
        public string? Staffid { get; set; }
        [Column("CUSTOMERID")]
        [StringLength(64)]
        public string Customerid { get; set; } = null!;
        [Column("ORDERID")]
        [StringLength(64)]
        public string Orderid { get; set; } = null!;
        [Column("INVOICECREATEDDATE")]
        public long? Invoicecreateddate { get; set; }
        [Column("INVOICETRACKINGCODE")]
        [StringLength(128)]
        public string? Invoicetrackingcode { get; set; }
        [Column("INVOICEADRESS")]
        [StringLength(256)]
        public string? Invoiceadress { get; set; }
        [Column("INVOICESHIPCOST")]
        public int? Invoiceshipcost { get; set; }

        [ForeignKey("Customerid")]
        [InverseProperty("Invoices")]
        public virtual Customer Customer { get; set; } = null!;
        [ForeignKey("Orderid")]
        [InverseProperty("Invoices")]
        public virtual Order Order { get; set; } = null!;
        [ForeignKey("Staffid")]
        [InverseProperty("Invoices")]
        public virtual staff? Staff { get; set; }
        [InverseProperty("Invoice")]
        public virtual ICollection<Invoicedetail> Invoicedetails { get; set; }
    }
}
