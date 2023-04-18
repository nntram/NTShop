using Abp.Extensions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NTShop.Models.AuthModels;
using NTShop.Services.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace NTShop.Services
{
    public class TokenService : ITokenService
    {
        public IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateAccessToken(AccountModel account)
        {
            //create claims details based on the user information
            var claims = new List<Claim> {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUnixTimestamp().ToString()),
                        new Claim(JwtRegisteredClaimNames.Name, account.UserName),
                        new Claim(JwtRegisteredClaimNames.Email, account.Email),                       
                        new Claim(ClaimTypes.Role, account.Role),
                        new Claim("Id", account.UserId),
                        new Claim("Role", account.Role),
                        new Claim("Avatar", account.Avatar != null ? account.Avatar : ""),
                        new Claim("DisplayName", account.DisplayName),
                        new Claim("RefreshTokenExpire", DateTime.Now.AddDays(7).ToUnixTimestamp().ToString()),
                    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signIn);

            return (new JwtSecurityTokenHandler().WriteToken(token)); ;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        public static CookieOptions HttpOnlyCookieOptions()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
            };

            return cookieOptions;
        }

        public async Task<RecaptchaResponseModel> VerifyReCaptcha(string token)
        {
            string secretKey = _configuration["RecaptchaSettings:SecretKey"];

            HttpClient client= new HttpClient();

            var response = await client.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}");
            var verify = JsonConvert.DeserializeObject<RecaptchaResponseModel>(response);

            return verify;
        }

        public string GetUserIdFromToken(string authorization)
        {
            var token = authorization.Substring(7);
            var principal = GetPrincipalFromExpiredToken(token);
            var userId = principal.Claims.First(p => p.Type == "Id").Value;

            return userId;
        }
    }
}
