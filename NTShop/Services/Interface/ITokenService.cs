using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.AuthModel;
using System.Security.Claims;

namespace NTShop.Services.Interface
{
    public interface ITokenService
    {
        string GenerateAccessToken(AccountModel account);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
