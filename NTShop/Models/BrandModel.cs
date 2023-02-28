using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class BrandModel
    {
        public string Brandid { get; set; } = null!;
        public string? Brandname { get; set; }
        public string? Brandimage { get; set; }
        public long? Brandcreateddate { get; set; }
    }
}
