

namespace NTShop.Models
{
    public class ProductModel
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
        public bool? Productisactive { get; set; }        
        public int Productcode { get; set; }
        public bool? Productishot { get; set; }
        public string Categoryname { get; set; } = null!;
        public string Brandname{ get; set; } = null!;
        public List<ProductImageModel> Productimages { get; set; }
    }
}
