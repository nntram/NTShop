﻿namespace NTShop.Models.AuthModels
{
    public class AccountModel
    {
        public AccountModel()
        {
        }

        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public long? TokenExpiryTime { get; set; }
        public bool? IsActive { get; set; } = false;
    }
}
