using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        public IConfiguration _configuration;

        public AuthController(ICustomerRepository customerRepository, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _configuration = configuration;
        }

        [Route("{area}/login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginModel model, [FromRoute]string area)
        {
            string userId = "", userName = "", password = "", displayName = "", email = "", role = "";
            if(area == "customer")
            {
                var data = await _customerRepository.GetByUserName(model.UserName);
                if (data == null)
                {
                    return BadRequest("Tài khoản không tồn tại.");
                }
                userId = data.Customerid;
                userName = data.Customerusername;
                password = data.Customerpassword;
                displayName = data.Customername;
                email = data.Customeremail;
                role = "customer";
            }
            
            if (BC.Verify(model.Password, password))
            {
                //create claims details based on the user information
                var claims = new List<Claim> {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),  
                        new Claim(ClaimTypes.Role, "Customer"),
                        new Claim("Role", role),
                        new Claim("UserId", userId),
                        new Claim("DisplayName", displayName),
                        new Claim("UserName", userName),
                        new Claim("Email", email),

                    };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(10),
                    signingCredentials: signIn);

                return Ok(new JwtSecurityTokenHandler().WriteToken(token));
            }


            return BadRequest("Sai mật khẩu.");
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("test")]
        public IActionResult Auth()
        {
            return Ok();
        }
    }

}