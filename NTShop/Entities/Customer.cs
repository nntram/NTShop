using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("CUSTOMER")]
    [Index("Wardid", Name = "CUSTOMER_WARD_FK")]
    public partial class Customer
    {
        public Customer()
        {
            Carts = new HashSet<Cart>();
            Invoices = new HashSet<Invoice>();
            Orders = new HashSet<Order>();
        }

        [Key]
        [Column("CUSTOMERID")]
        [StringLength(64)]
        public string Customerid { get; set; } = null!;
        [Column("WARDID")]
        [StringLength(64)]
        public string Wardid { get; set; } = null!;
        [Column("CUSTOMERNAME")]
        [StringLength(128)]
        public string? Customername { get; set; }
        [Column("CUSTOMERGENDER")]
        public bool? Customergender { get; set; }
        [Column("CUSTIOMERCREATEDDATE")]
        public long? Custiomercreateddate { get; set; }
        [Column("CUSTOMERPHONENUMBER")]
        [StringLength(16)]
        public string? Customerphonenumber { get; set; }
        [Column("CUSTOMERADDRESS")]
        [StringLength(256)]
        public string? Customeraddress { get; set; }
        [Column("CUSTOMEREMAIL")]
        [StringLength(128)]
        public string? Customeremail { get; set; }
        [Column("CUSTOMEREMAILCONFIRM")]
        public bool? Customeremailconfirm { get; set; }
        [Column("CUSTOMERUSERNAME")]
        [StringLength(128)]
        public string? Customerusername { get; set; }
        [Column("CUSTOMERPASSWORD")]
        [StringLength(256)]
        public string? Customerpassword { get; set; }
        [Column("CUSTOMERAVATAR")]
        [StringLength(256)]
        public string? Customeravatar { get; set; }
        [Column("CUSTOMERISACTIVE")]
        public bool? Customerisactive { get; set; }
        [Column("CUSTOMERREFRESHTOKEN")]
        [StringLength(128)]
        [Unicode(false)]
        public string? Customerrefreshtoken { get; set; }
        [Column("CUSTOMERTOKENEXPIRYTIME")]
        public long? Customertokenexpirytime { get; set; }

        [ForeignKey("Wardid")]
        [InverseProperty("Customers")]
        public virtual Ward Ward { get; set; } = null!;
        [InverseProperty("Customer")]
        public virtual ICollection<Cart> Carts { get; set; }
        [InverseProperty("Customer")]
        public virtual ICollection<Invoice> Invoices { get; set; }
        [InverseProperty("Customer")]
        public virtual ICollection<Order> Orders { get; set; }
    }
}
