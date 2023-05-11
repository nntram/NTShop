using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.DeleteModels;
using NTShop.Models.Filters;
using NTShop.Models.UpdateModels;
using NTShop.Repositories;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;

namespace NTShop.Controllers
{
    [Route("orders")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ITokenService _tokenService;

        public OrdersController(IOrderRepository orderRepository, 
                                ITokenService tokenService)
        {
            _orderRepository = orderRepository;
            _tokenService = tokenService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetOders([FromHeader] string authorization)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _orderRepository.GetCustomerOrders(userId);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            
            var data = await _orderRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet("order-status")]
        public async Task<IActionResult> GetOderStatus()
        {

            var data = await _orderRepository.GetOrderStatus();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        [Authorize(Roles = "Admin, Staff")]
        [HttpGet("get-paged")]
        public async Task<IActionResult> GetPagedOrders([FromQuery] OrderGetpagedModel model)
        {
            var data = await _orderRepository.GetPagedOrders(model);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        [Authorize(Roles = "Admin, Staff")]
        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateOrderStatus([FromHeader] string authorization,
                               [FromBody] OrderStatusUpdateModel model)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            model.StaffId = userId;

            var data = await _orderRepository.UpdateOrderStatus(model);
            if (!data)
            {
                return BadRequest("Chưa cập nhật được.");
            }

            return Ok("Cập nhật trạng thái đơn hàng thành công.");

        }
    }
}
