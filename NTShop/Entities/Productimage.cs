using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("PRODUCTIMAGE")]
    [Index("Productid", Name = "PRODUCT_IMAGE_FK")]
    public partial class Productimage
    {
        [Key]
        [Column("PRODUCTIMAGEID")]
        [StringLength(64)]
        public string Productimageid { get; set; } = null!;
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Column("PRODUCTIMAGEURL")]
        [StringLength(1024)]
        public string? Productimageurl { get; set; }

        [ForeignKey("Productid")]
        [InverseProperty("Productimages")]
        public virtual Product Product { get; set; } = null!;
    }
}
