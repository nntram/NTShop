using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _categoryRepository.GetAllAsync();
            return Ok(data);
        }
  
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _categoryRepository.GetByIdAsync(id);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Create([FromForm] CategoryCreateModel model)
        {

            var data = await _categoryRepository.Create(model);
            if (data == "success")
            {
                return Ok("Thêm mới thành công.");
            }
            return BadRequest(data);
        }

        [HttpPost("update")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Update([FromForm] CategoryUpdateModel model)
        {
            var data = await _categoryRepository.Update(model);
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
            var data = await _categoryRepository.Delete(id);
            if (data == "success")
            {
                return Ok("Xóa thành công.");
            }
            return BadRequest(data);
        }
    }
}
