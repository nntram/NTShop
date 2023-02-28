using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class CategoryModel
    {
        public string Categoryid { get; set; } = null!;
        public string? Categoryname { get; set; }
        public string? Categoryimage { get; set; }
        public long? Categorycreateddate { get; set; }
    }
}
