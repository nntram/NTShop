
using NTShop.Models.AuthModels;
using System.Security.Claims;

namespace NTShop.Services.Interface
{
    public interface ITokenService
    {
        string GenerateAccessToken(AccountModel account);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        public Task<RecaptchaResponseModel> VerifyReCaptcha(string token);
    }
}
