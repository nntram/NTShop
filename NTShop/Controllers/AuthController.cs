using Microsoft.AspNetCore.Mvc;
using NTShop.Models;
using NTShop.Models.AuthModel;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ITokenService _tokenService;

        public AuthController(ICustomerRepository customerRepository, ITokenService tokenService)
        {
            _customerRepository = customerRepository;
            _tokenService = tokenService;
        }

        [Route("{area}/login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginModel loginModel, [FromRoute]string area)
        {
            if (loginModel is null)
            {
                return BadRequest();
            }

            if(area == "customer")
            {
                var data = await _customerRepository.GetByUserName(loginModel.UserName);
                if (data == null || data.IsActive == false )
                {
                    return NotFound("Tài khoản không tồn tại.");
                }

                if (BC.Verify(loginModel.Password, data.Password))
                {
                    var accessToken = _tokenService.GenerateAccessToken(data);
                    var refreshToken = _tokenService.GenerateRefreshToken();

                    data.RefreshToken = refreshToken;
                    data.TokenExpiryTime = DateTime.Now.AddDays(7);

                    var update = await _customerRepository.UpdateAccountAsync(data);
                    if (update is true)
                    {
                        _tokenService.SetRefreshToken(Response, refreshToken);
                        var response = new AuthResponse();

                        response.AccessToken = accessToken;
                        response.UserId = data.UserId;
                        response.Role = "Customer";
                        response.DisplayName = data.DisplayName;

                        return Ok(response);
                    }
                    return StatusCode(500);
                }
            }
            
            return BadRequest("Sai mật khẩu.");
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromHeader]string authorization)
        {
            if (authorization is null)
            {
                return BadRequest();
            }

            string accessToken = authorization.Substring(7);
            string refreshToken = Request.Cookies["refreshToken"];

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name;

            var data = await _customerRepository.GetByUserName(userName);
            if (data == null || 
                data.RefreshToken != refreshToken || 
                data.TokenExpiryTime <= DateTime.Now)
            {
                return NotFound();
            }

            var newAccessToken = _tokenService.GenerateAccessToken(data);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            data.RefreshToken = newRefreshToken;
            data.TokenExpiryTime = DateTime.Now.AddDays(7);

            var update = await _customerRepository.UpdateAccountAsync(data);
            if (update is true)
            {
                _tokenService.SetRefreshToken(Response, newRefreshToken);
                var response = new AuthResponse();

                response.AccessToken = newAccessToken;
                response.UserId = data.UserId;
                response.Role = "Customer";
                response.DisplayName = data.DisplayName;

                return Ok(response);
            }
            return StatusCode(500);
        }




    }

}