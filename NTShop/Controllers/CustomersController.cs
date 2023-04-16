using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Models.SendMail;
using NTShop.Repositories.Interface;
using NTShop.Services;
using NTShop.Services.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("customers")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ITokenService _tokenService;
        private readonly IMailService _mailService;

        public CustomersController(ICustomerRepository customerRepository, 
            ITokenService tokenService, IMailService mailService)
        {
            _customerRepository = customerRepository;
            _tokenService = tokenService;
            _mailService = mailService;
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
        [HttpPost("")]
        public async Task<IActionResult> Create([FromForm] CustomerCreateModel model)
        {
            var captchaVerify = _tokenService.VerifyReCaptcha(model.Token);

            if (captchaVerify == null || !captchaVerify.Result.success)
            {
                return BadRequest("Lỗi Google reCaptcha.");
            }

            if (captchaVerify.Result.score < 0.5)
            {
                return BadRequest("Thao tác bị chặn bởi Google reCaptcha.");
            }
            var data = await _customerRepository.CreatetAsync(model);
            if(data.StartsWith("Ok:"))
            {
                var id = data.Substring(3);
                var mailCalss = GetMailObject(id, model.Customername, model.Customeremail);
                var mailSend = await _mailService.SendMail(mailCalss);
                if(mailSend == MessageMail.MailSent)
                {
                    return Ok("Đăng ký thành công. Vui lòng xác nhận email để đăng nhập.");
                }
                else
                {
                    return BadRequest("Không thể xác nhận email. Vui lòng kiểm tra và đăng ký đúng địa chỉ email.");
                }
                
            }
            return BadRequest(data);
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> IsUsernameExist([FromRoute] string username)
        {
            var data = await _customerRepository.IsUsernameExist(username);
            return Ok(data);
        }

        private MailClass GetMailObject(string id, string name,string email)
        {
            MailClass mailClass = new MailClass();
            mailClass.Subject = "Mail Confirmation";
            mailClass.Body = _mailService.GetMailBody(id, name);
            mailClass.ToMails = new List<string>()
            {
                email
            };

            return mailClass;
        }

        [HttpPost("confirm-mail")]
        public async Task<IActionResult> ConfirmMail(string id)
        {
            var data = await _customerRepository.ConfirmEmail(id);
            if (data)
            {
                return Ok("Đã xác nhận mail.");
            }
            return BadRequest("Xác nhận mail không thành công.");
        }

    }
}
