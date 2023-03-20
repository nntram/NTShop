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

            var account = new AccountModel();
            if(area == "customer")
            {
                var data = await _customerRepository.GetByUserName(loginModel.UserName);
                if (data == null)
                {
                    return BadRequest("Tài khoản không tồn tại.");
                }

                 account = _tokenService.CustomerToAccountModel(data);
            }
            
            if (BC.Verify(loginModel.Password, account.Password))
            {
                var accessToken = _tokenService.GenerateAccessToken(account);
                var refreshToken = _tokenService.GenerateRefreshToken();

                _tokenService.SetRefreshToken(Response, refreshToken);

                return Ok(accessToken);
            }

            return BadRequest("Sai mật khẩu.");
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromForm]TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest();
            }

            string accessToken = tokenModel.AccessToken;
            string refreshToken = tokenModel.RefreshToken;

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name;

            var data = await _customerRepository.GetByUserName(userName);
            if (data == null)
            {
                return BadRequest("Tài khoản không tồn tại.");
            }

            //if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            //    return BadRequest("Invalid client request");

            var account = _tokenService.CustomerToAccountModel(data);
            var newAccessToken = _tokenService.GenerateAccessToken(account);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            //user.RefreshToken = newRefreshToken;
            //_userContext.SaveChanges();

            _tokenService.SetRefreshToken(Response, newRefreshToken);
            return Ok(newAccessToken);
        }




    }

}