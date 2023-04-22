using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Repositories;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;

namespace NTShop.Controllers
{
    [Route("orders")]
    [ApiController]
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
    }
}
