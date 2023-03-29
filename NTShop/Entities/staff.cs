using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("STAFF")]
    [Index("Roleid", Name = "STAFF_ROLE_FK")]
    public partial class staff
    {
        public staff()
        {
            Invoices = new HashSet<Invoice>();
            Orders = new HashSet<Order>();
            Warehousereceipts = new HashSet<Warehousereceipt>();
        }

        [Key]
        [Column("STAFFID")]
        [StringLength(64)]
        public string Staffid { get; set; } = null!;
        [Column("ROLEID")]
        [StringLength(64)]
        public string Roleid { get; set; } = null!;
        [Column("STAFFNAME")]
        [StringLength(128)]
        public string? Staffname { get; set; }
        [Column("STAFFGENDER")]
        public int? Staffgender { get; set; }
        [Column("STAFFPHONENUMBER")]
        [StringLength(16)]
        public string? Staffphonenumber { get; set; }
        [Column("STAFFEMAIL")]
        [StringLength(256)]
        public string? Staffemail { get; set; }
        [Column("STAFFCREAREDDATE")]
        public long? Staffcreareddate { get; set; }
        [Column("STAFFLOGINNAME")]
        [StringLength(128)]
        public string? Staffloginname { get; set; }
        [Column("STAFFPASSWORD")]
        [StringLength(256)]
        public string? Staffpassword { get; set; }
        [Column("STAFFISACTIVE")]
        public bool? Staffisactive { get; set; }
        [Column("STAFFREFRESHTOKEN")]
        [StringLength(128)]
        [Unicode(false)]
        public string? Staffrefreshtoken { get; set; }
        [Column("STAFFTOKENEXPIRYTIME")]
        public long? Stafftokenexpirytime { get; set; }

        [ForeignKey("Roleid")]
        [InverseProperty("staff")]
        public virtual Role Role { get; set; } = null!;
        [InverseProperty("Staff")]
        public virtual ICollection<Invoice> Invoices { get; set; }
        [InverseProperty("Staff")]
        public virtual ICollection<Order> Orders { get; set; }
        [InverseProperty("Staff")]
        public virtual ICollection<Warehousereceipt> Warehousereceipts { get; set; }
    }
}
