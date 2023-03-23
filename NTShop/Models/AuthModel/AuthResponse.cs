namespace NTShop.Models.AuthModel
{
    public class AuthResponse
    {
        public AuthResponse()
        {
        }

        public string? UserId { get; set; }
        public string? DisplayName { get; set;}
        public string? Role { get; set;}
        public string? AccessToken { get; set;}
    }
}
