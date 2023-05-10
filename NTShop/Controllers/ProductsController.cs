using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.Filters;
using NTShop.Models.UpdateModels;
using NTShop.Repositories;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _productRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _productRepository.GetByIdAsync(id);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCard([FromQuery] ProductFilterModel filter)
        {
            var data = await _productRepository.GetAllCardAsync(filter);
            return Ok(data);
        }

        [HttpPost("")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Create([FromForm] ProductCreateModel model)
        {

            var data = await _productRepository.Create(model);
            if (data == "success")
            {
                return Ok("Thêm mới thành công.");
            }
            return BadRequest(data);
        }
        [HttpPost("update")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> Update([FromForm] ProductUpdateModel model)
        {
            var data = await _productRepository.Update(model);
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
            var data = await _productRepository.Delete(id);
            if (data == "success")
            {
                return Ok("Xóa thành công.");
            }
            if (data == "update")
            {
                return Ok("Sản phẩm chưa thể xóa do ràng buộc. Sản phẩm đã chuyển sang ngừng kinh doanh.");
            }
            return BadRequest(data);
        }

    }
}
