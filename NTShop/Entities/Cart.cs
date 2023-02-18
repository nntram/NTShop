using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("CART")]
    [Index("Customerid", Name = "CUSTOMER_CARD_FK")]
    public partial class Cart
    {
        public Cart()
        {
            Cartdetails = new HashSet<Cartdetail>();
        }

        [Key]
        [Column("CARTID")]
        [StringLength(64)]
        public string Cartid { get; set; } = null!;
        [Column("CUSTOMERID")]
        [StringLength(64)]
        public string? Customerid { get; set; }
        [Column("CARTQUANTITY")]
        public int? Cartquantity { get; set; }

        [ForeignKey("Customerid")]
        [InverseProperty("Carts")]
        public virtual Customer? Customer { get; set; }
        [InverseProperty("Cart")]
        public virtual ICollection<Cartdetail> Cartdetails { get; set; }
    }
}
