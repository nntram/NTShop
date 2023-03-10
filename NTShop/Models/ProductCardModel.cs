namespace NTShop.Models
{
    public class ProductCardModel
    {
        public string Productid { get; set; } = null!;       
        public string? Productname { get; set; }
        public int? Productprice { get; set; }
        public int? Productsaleprice { get; set; }
        public bool? Productisacitve { get; set; }
        public int Productcode { get; set; }
        public bool? Productishot { get; set; }
        public string Categoryname { get; set; } = null!;
        public string Brandname { get; set; } = null!;
        public string Productimages { get; set; } = null!;
    }
}
