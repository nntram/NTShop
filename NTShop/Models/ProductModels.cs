using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class ProductModels
    {
        public string Productid { get; set; } = null!;     
        public string Categoryid { get; set; } = null!;       
        public string Brandid { get; set; } = null!;       
        public string? Productname { get; set; }        
        public string? Productdescribe { get; set; }       
        public int? Productprice { get; set; }      
        public int? Productsaleprice { get; set; }       
        public int? Productquantity { get; set; }       
        public long? Productcreateddate { get; set; }      
        public bool? Productinacitve { get; set; }        
        public int Productcode { get; set; }
        public bool? Productishot { get; set; }
    }
}
