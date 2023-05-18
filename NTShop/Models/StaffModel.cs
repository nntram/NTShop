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
        public long? Staffcreateddate { get; set; }
        public string? Staffloginname { get; set; }
        public bool? Staffisactive { get; set; }
        public string? Staffrefreshtoken { get; set; }
        public long? Stafftokenexpirytime { get; set; }
        public RoleModel Role { get; set; }
    }
}
