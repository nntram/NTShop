using Abp.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.AuthModels;
using NTShop.Models.SendMail;
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
        private readonly IMailService _mailService;
        private readonly IStaffRepository _staffRepository;

        public AuthController(ICustomerRepository customerRepository, ITokenService tokenService, 
                            IMailService mailService, IStaffRepository staffRepository)
        {
            _customerRepository = customerRepository;
            _tokenService = tokenService;
            _mailService = mailService;
            _staffRepository = staffRepository;
        }

        [Route("{area}/login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginModel loginModel, [FromRoute] string area)
        {
            var captchaVerify = _tokenService.VerifyReCaptcha(loginModel.Token);

            if (captchaVerify == null || !captchaVerify.Result.success)
            {
                return BadRequest("Lỗi Google reCaptcha.");
            }

            if (captchaVerify.Result.score < 0.5)
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
                return BadRequest("Sai mật khẩu.");
            }
            else if (area == "admin")
            {
                var data = await _staffRepository.GetByUserName(loginModel.UserName);
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

                    var update = await _staffRepository.UpdateTokenAsync(data);
                    if (update is true)
                    {
                        Response.Cookies.Append("refreshToken", refreshToken, HttpOnlyCookieOptions());
                        return Ok(accessToken);
                    }
                    return StatusCode(500);
                }
                return BadRequest("Sai mật khẩu.");
            }

            return NotFound("Sai đường dẫn.");

            
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

        [Route("{area}/forgot-password")]
        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model, [FromRoute] string area)
        {
            if (area == "customer")
            {
                var data = await _customerRepository.GetByUserName(model.Username);
                if (data == null)
                {
                    return NotFound("Tài khoản không tồn tại.");
                }

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
                    var hiddenMail = data.Email;
                    var index = hiddenMail.IndexOf("@");
                    for(int i = 2; i < index - 2; i++)
                    {
                        hiddenMail = hiddenMail.Remove(i, 1).Insert(i, "*");
                    }
                    var mailClass = GetForotPasswordMailObject(data.UserName, accessToken, data.Email);
                    var mailSend = await _mailService.SendMail(mailClass);
                    if(mailSend == MessageMail.MailSent)
                    {
                        return Ok("Chúng tôi đã gửi xác nhận về địa chỉ " + hiddenMail + ". Vui lòng kiểm tra mail.");
                    }
                }

                return StatusCode(500);

            }


            return StatusCode(500);
        }

        private MailClass GetForotPasswordMailObject(string username, string token, string email)
        {
            MailClass mailClass = new MailClass();
            mailClass.Subject = "Quên mật khẩu";
            mailClass.Body = _mailService.GetMailBodyToForgotPassword(username, token);
            mailClass.ToMails = new List<string>()
            {
                email
            };

            return mailClass;
        }

        [Authorize]
        [Route("{area}/reset-password")]
        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model, 
                    [FromHeader] string authorization, [FromRoute] string area)
        {
            var token = authorization.Substring(7);
            var principal = _tokenService.GetPrincipalFromExpiredToken(token);
            var userName = principal.Identity.Name;

            if (area == "customer")
            {
                var data = await _customerRepository.GetByUserName(userName);
                if (data == null)
                {
                    return NotFound("Tài khoản không tồn tại.");
                }

                data.Password = model.Password;
                var result = await _customerRepository.ResetPasswordAsync(data);
                if (result)
                {
                    return Ok("Đặt lại mật khẩu thành công. Hãy đăng nhập với mật khẩu mới.");
                }

            }


            return StatusCode(500);
        }

    }
}
