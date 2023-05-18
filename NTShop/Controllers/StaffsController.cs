using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.Filters;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;

namespace NTShop.Controllers
{
    [Route("staffs")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StaffsController : ControllerBase
    {

        private readonly IStaffRepository _staffRepository;
        private readonly ITokenService _tokenService;
        private readonly IMailService _mailService;

        public StaffsController(IStaffRepository staffRepository,
            ITokenService tokenService, IMailService mailService)
        {
            _staffRepository = staffRepository;
            _tokenService = tokenService;
            _mailService = mailService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _staffRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _staffRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
    }
}
