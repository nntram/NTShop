namespace NTShop.Models.SendMail
{
    public class LoginInfo
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsMailConfirmed { get; set; }
    }
}
