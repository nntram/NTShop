namespace NTShop.Models
{
    public class CartModel
    {
        public string Cartid { get; set; } = null!;
        public string? Customerid { get; set; }
        public int? Cartquantity { get; set; }
        public List<CartDetailModel> Cartdetails { get; set; }
    }
}
