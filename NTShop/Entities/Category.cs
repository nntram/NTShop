using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("CATEGORY")]
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        [Key]
        [Column("CATEGORYID")]
        [StringLength(64)]
        public string Categoryid { get; set; } = null!;
        [Column("CATEGORYNAME")]
        [StringLength(256)]
        public string? Categoryname { get; set; }
        [Column("CATEGORYCREATEDDATE")]
        public long? Categorycreateddate { get; set; }
        [Column("CATEGORYIMAGE")]
        [StringLength(256)]
        public string? Categoryimage { get; set; }

        [InverseProperty("Category")]
        public virtual ICollection<Product> Products { get; set; }
    }
}
