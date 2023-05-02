using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("brands")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandRepository _brandRepository;

        public BrandsController(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _brandRepository.GetAllAsync();
            return Ok(data);
        }     

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _brandRepository.GetByIdAsync(id);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Create([FromForm] BrandCreateModel model )
        {
            var data = await _brandRepository.Create(model);
            if (data == "success")
            {
                return Ok("Thêm mới thành công.");
            }
            return BadRequest(data);
        }

        [HttpPost("update")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Update([FromForm] BrandUpdateModel model)
        {
            var data = await _brandRepository.Update(model);
            if (data == "success")
            {
                return Ok("Lưu thay đổi thành công.");
            }
            return BadRequest(data);
        }

        [HttpPost("delete/{id}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var data = await _brandRepository.Delete(id);
            if (data == "success")
            {
                return Ok("Xóa thành công.");
            }
            return BadRequest(data);
        }
    }
}
