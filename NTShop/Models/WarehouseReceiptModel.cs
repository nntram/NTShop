using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class WarehouseReceiptModel
    {
        [StringLength(64)]
        public string Warehousereceiptid { get; set; } = null!;
        [StringLength(64)]
        public string Staffid { get; set; } = null!;
        [StringLength(64)]
        public string Supplierid { get; set; } = null!;
        public long? Warehousereceiptcreateddate { get; set; }
        public List<WarehouseReceiptDetailModel>? Warehousereceiptdetails { get; set;}
        public StaffModel? Staff { get;set; }
        public SupplierModel? Supplier { get; set; }
        [StringLength(64)]
        public string Warehousereceiptcode { get; set; } = null!;
    }
}
