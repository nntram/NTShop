using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class CustomerModel
    {
        public string Customerid { get; set; } = null!;
        public string Wardid { get; set; } = null!;
        public string? Customername { get; set; }
        public bool? Customergender { get; set; }
        public long? Customercreateddate { get; set; }
        [StringLength(16)]
        public string? Customerphonenumber { get; set; }
        public string? Customeraddress { get; set; }
        public string? Customeremail { get; set; }
        public string? Customeremailconfirm { get; set; }
        public string? Customerusername { get; set; }
        public string? Customeravatar { get; set; }
        public bool? Customerisactive { get; set; }
    }
}
