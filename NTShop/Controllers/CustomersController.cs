using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NTShop.Models;
using NTShop.Repositories.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("customers")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        public IConfiguration _configuration;

        public CustomersController(ICustomerRepository customerRepository, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _configuration = configuration;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _customerRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _customerRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginModel model)
        {
            var data = await _customerRepository.GetByUserName(model.UserName);
            if (data == null)
            {
                return BadRequest("Tài khoản không tồn tại.");
            }
            if (BC.Verify(model.Password, data.Customerpassword))
            {
                //create claims details based on the user information
                var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserId", data.Customerid.ToString()),
                        new Claim("DisplayName", data.Customername),
                        new Claim("UserName", data.Customerusername),
                        new Claim("Email", data.Customeremail)
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
    }
}
