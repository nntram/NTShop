using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.CreateModels
{
    public class WarehouseReceiptCreateModel
    {
        [Required]
        [StringLength(64)]
        public string Staffid { get; set; } = null!;
        [StringLength(64)]
        [Required]
        public string Supplierid { get; set; } = null!;
        [Required]
        public long? Warehousereceiptcreateddate { get; set; }
        [Required]
        public string StrWarehousereceiptdetail { get; set; }
        public WarehouseReceiptDetailCreateModel[]? Warehousereceiptdetail { get; set; }

    }
}
