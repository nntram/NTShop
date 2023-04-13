using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.AuthModels;
using NTShop.Models.CreateModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("customers")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ITokenService _tokenService;

        public CustomersController(ICustomerRepository customerRepository, ITokenService tokenService)
        {
            _customerRepository = customerRepository;
            _tokenService = tokenService;
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
            if(data == "Ok")
            {
                return Ok();
            }
            return BadRequest(data);
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> IsUsernameExist([FromRoute] string username)
        {
            var data = await _customerRepository.IsUsernameExist(username);
            return Ok(data);
        }

    }
}
