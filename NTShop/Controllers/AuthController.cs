﻿using Abp.Extensions;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.AuthModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;
using BC = BCrypt.Net.BCrypt;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : Controller
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
        public async Task<IActionResult> Login([FromForm] LoginModel loginModel, [FromRoute] string area)
        {
            var captchaVerify = _tokenService.VerifyReCaptcha(loginModel.Token);

            if(captchaVerify == null || !captchaVerify.Result.success)
            {
                return BadRequest("Lỗi Google reCaptcha.");
            }

            if(captchaVerify.Result.score < 0.5)
            {
                return BadRequest("Thao tác bị chặn bởi Google reCaptcha.");
            }

            if (area == "customer")
            {
                var data = await _customerRepository.GetByUserName(loginModel.UserName);
                if (data == null)
                {
                    return NotFound("Tài khoản không tồn tại.");
                }
                

                if (BC.Verify(loginModel.Password, data.Password))
                {
                    if (data.IsActive == false)
                    {
                        return NotFound("Tài khoản đã bị vô hiệu hoặc chưa được xác nhận.");
                    }

                    var accessToken = _tokenService.GenerateAccessToken(data);
                    var refreshToken = _tokenService.GenerateRefreshToken();

                    data.RefreshToken = refreshToken;
                    data.TokenExpiryTime = (long)DateTime.Now.AddDays(7).ToUnixTimestamp();

                    var update = await _customerRepository.UpdateTokenAsync(data);
                    if (update is true)
                    {
                        Response.Cookies.Append("refreshToken", refreshToken, HttpOnlyCookieOptions());
                        return Ok(accessToken);
                    }
                    return StatusCode(500);
                }
            }

            return BadRequest("Sai mật khẩu.");
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromForm] string authorization)
        {
            if (authorization is null)
            {
                return BadRequest();
            }

            string refreshToken = Request.Cookies["refreshToken"];

            var principal = _tokenService.GetPrincipalFromExpiredToken(authorization);
            var userName = principal.Identity.Name;

            var data = await _customerRepository.GetByUserName(userName);
            if (data == null)
            {
                return NotFound("Tài khoản không tồn tại.");
            }
            if (data.RefreshToken != refreshToken)
            {
                return NotFound("Refresh token không đúng.\n data:" + data.RefreshToken + "\n cookie: \n " + refreshToken);
            }
            if (data.TokenExpiryTime <= DateTime.Now.ToUnixTimestamp())
            {
                return NotFound("Refresh token hết hạn.");
            }

            var newAccessToken = _tokenService.GenerateAccessToken(data);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            data.RefreshToken = newRefreshToken;
            data.TokenExpiryTime = (long)DateTime.Now.AddDays(7).ToUnixTimestamp();

            var update = await _customerRepository.UpdateTokenAsync(data);
            if (update is true)
            {
                Response.Cookies.Append("refreshToken", newRefreshToken, HttpOnlyCookieOptions());
                return Ok(newAccessToken);
            }
            return StatusCode(500);
        }


        private static CookieOptions HttpOnlyCookieOptions()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
                SameSite = SameSiteMode.None,
                Secure = true,
            };

            return cookieOptions;
        }

    }
}
