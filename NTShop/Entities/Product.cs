using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("PRODUCT")]
    [Index("Categoryid", Name = "CATEGORY_PRODUCT_FK")]
    [Index("Brandid", Name = "PRODUCT_BRAND_FK")]
    public partial class Product
    {
        public Product()
        {
            Cartdetails = new HashSet<Cartdetail>();
            Invoicedetails = new HashSet<Invoicedetail>();
            Orderdetails = new HashSet<Orderdetail>();
            Productimages = new HashSet<Productimage>();
            Warehousereceiptdetails = new HashSet<Warehousereceiptdetail>();
        }

        [Key]
        [Column("PRODUCTID")]
        [StringLength(64)]
        public string Productid { get; set; } = null!;
        [Column("CATEGORYID")]
        [StringLength(64)]
        public string Categoryid { get; set; } = null!;
        [Column("BRANDID")]
        [StringLength(64)]
        public string Brandid { get; set; } = null!;
        [Column("PRODUCTNAME")]
        [StringLength(256)]
        public string? Productname { get; set; }
        [Column("PRODUCTDESCRIBE")]
        public string? Productdescribe { get; set; }
        [Column("PRODUCTPRICE")]
        public int? Productprice { get; set; }
        [Column("PRODUCTSALEPRICE")]
        public int? Productsaleprice { get; set; }
        [Column("PRODUCTQUANTITY")]
        public int? Productquantity { get; set; }
        [Column("PRODUCTCREATEDDATE")]
        public long? Productcreateddate { get; set; }
        [Column("PRODUCTISACITVE")]
        public bool? Productisacitve { get; set; }
        [Column("PRODUCTCODE")]
        public int Productcode { get; set; }
        [Column("PRODUCTISHOT")]
        public bool? Productishot { get; set; }

        [ForeignKey("Brandid")]
        [InverseProperty("Products")]
        public virtual Brand Brand { get; set; } = null!;
        [ForeignKey("Categoryid")]
        [InverseProperty("Products")]
        public virtual Category Category { get; set; } = null!;
        [InverseProperty("Product")]
        public virtual ICollection<Cartdetail> Cartdetails { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<Invoicedetail> Invoicedetails { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<Productimage> Productimages { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<Warehousereceiptdetail> Warehousereceiptdetails { get; set; }
    }
}
