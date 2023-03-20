﻿using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.AuthModel;
using NTShop.Services.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
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
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim(JwtRegisteredClaimNames.Name, account.UserName),
                        new Claim(JwtRegisteredClaimNames.NameId, account.UserId),
                        new Claim(JwtRegisteredClaimNames.Email, account.Email),
                        new Claim(ClaimTypes.Role, account.Role),                        
                        new Claim("Role", account.Role),
                        new Claim("DisplayName", account.DisplayName),
                    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(10),
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

        public void SetRefreshToken(HttpResponse respone, string newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
            };
            respone.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);           
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

        public AccountModel CustomerToAccountModel(CustomerModel data)
        {
            var account = new AccountModel();

            account.UserId = data.Customerid;
            account.UserName = data.Customerusername;
            account.DisplayName = data.Customername;
            account.Email = data.Customeremail;
            account.Role = "Customer";
            account.Password = data.Customerpassword;

            return account;
        }
    }
}
