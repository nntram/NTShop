using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [Route("warehouseReceipts")]
    [ApiController]
    [Authorize(Roles = "Admin, Staff")]
    public class WarehouseReceiptsController : ControllerBase
    {
        private readonly IWarehouseReceiptRepository _warehouseReceiptRepository;

        public WarehouseReceiptsController(IWarehouseReceiptRepository warehouseReceiptRepository)
        {
            _warehouseReceiptRepository = warehouseReceiptRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _warehouseReceiptRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _warehouseReceiptRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("")]       
        public async Task<IActionResult> Create([FromForm] WarehouseReceiptCreateModel model)
        {

            var data = await _warehouseReceiptRepository.Create(model);
            if (data == "success")
            {
                return Ok("Thêm mới thành công.");
            }
            return BadRequest(data);
        }

      
    }
}
