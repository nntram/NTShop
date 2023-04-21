
using NTShop.Models.AuthModels;
using System.Security.Claims;

namespace NTShop.Services.Interface
{
    public interface ITokenService
    {
        public string GenerateAccessToken(AccountModel account);
        public string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        public Task<RecaptchaResponseModel> VerifyReCaptcha(string token);
        public string GetUserIdFromToken(string authorization);
        public string GetIpAddress();
    }
}
