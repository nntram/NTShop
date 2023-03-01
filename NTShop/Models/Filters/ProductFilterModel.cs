

namespace NTShop.Models.Filters
{
    public class ProductFilterModel
    {
        public string? Productid { get; set; }   
        public string? Categoryid { get; set; }      
        public string? Brandid { get; set; }    
        public string? Productname { get; set; }             
        public int? Productprice { get; set; }      
        public int? Productsaleprice { get; set; }       
        public int? Productquantity { get; set; }       
        public long? Productcreateddate { get; set; }      
        public bool? Productinacitve { get; set; }        
        public int Productcode { get; set; }
        public bool? Productishot { get; set; }
        public int? pageSize;
    }
}
