namespace NTShop.Models
{
    public class StaffModel
    {
        public string Staffid { get; set; } = null!;
        public string Roleid { get; set; } = null!;
        public string? Staffname { get; set; }
        public int? Staffgender { get; set; }
        public string? Staffphonenumber { get; set; }
        public string? Staffemail { get; set; }
        public long? Staffcreareddate { get; set; }
        public string? Staffloginname { get; set; }
        public string? Staffpassword { get; set; }
        public bool? Staffisactive { get; set; }
        public string? Staffrefreshtoken { get; set; }
        public long? Stafftokenexpirytime { get; set; }
    }
}
