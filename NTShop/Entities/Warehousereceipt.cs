using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("WAREHOUSERECEIPT")]
    [Index("Staffid", Name = "STAFF_WRRECEIPT_FK")]
    [Index("Supplierid", Name = "SUPPLIER_WAREHOUSE_FK")]
    public partial class Warehousereceipt
    {
        public Warehousereceipt()
        {
            Warehousereceiptdetails = new HashSet<Warehousereceiptdetail>();
        }

        [Key]
        [Column("WAREHOUSERECEIPTID")]
        [StringLength(64)]
        public string Warehousereceiptid { get; set; } = null!;
        [Column("STAFFID")]
        [StringLength(64)]
        public string? Staffid { get; set; }
        [Column("SUPPLIERID")]
        [StringLength(64)]
        public string Supplierid { get; set; } = null!;
        [Column("WAREHOUSERECEIPTCREATEDDATE")]
        public long? Warehousereceiptcreateddate { get; set; }
        [Column("WAREHOUSERECEIPTCODE")]
        [StringLength(64)]
        public string? Warehousereceiptcode { get; set; }

        [ForeignKey("Staffid")]
        [InverseProperty("Warehousereceipts")]
        public virtual staff? Staff { get; set; }
        [ForeignKey("Supplierid")]
        [InverseProperty("Warehousereceipts")]
        public virtual Supplier Supplier { get; set; } = null!;
        [InverseProperty("Warehousereceipt")]
        public virtual ICollection<Warehousereceiptdetail> Warehousereceiptdetails { get; set; }
    }
}
