using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [Route("suppliers")]
    [ApiController]
    [Authorize(Roles = "Admin, Staff")]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierRepository _supplierRepository;

        public SuppliersController(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _supplierRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _supplierRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("")]       
        public async Task<IActionResult> Create([FromForm] SupplierCreateModel model)
        {

            var data = await _supplierRepository.Create(model);
            if (data == "success")
            {
                return Ok("Thêm mới thành công.");
            }
            return BadRequest(data);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromForm] SupplierUpdateModel model)
        {
            var data = await _supplierRepository.Update(model);
            if (data == "success")
            {
                return Ok("Lưu thay đổi thành công.");
            }
            return BadRequest(data);
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var data = await _supplierRepository.Delete(id);
            if (data == "success")
            {
                return Ok("Xóa thành công.");
            }
            return BadRequest(data);
        }
    }
}
