using Abp.Runtime.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
using NTShop.Models.DeleteModels;
using NTShop.Repositories;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace NTShop.Controllers
{
    [Authorize]
    [Route("cart")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly ITokenService _tokenService;

        public CartsController(ICartRepository cartRepository, ITokenService tokenService)
        {
            _cartRepository = cartRepository;
            _tokenService = tokenService;
        }
       
        [HttpGet("")]
        public async Task<IActionResult> GetCart([FromHeader] string authorization)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _cartRepository.GetCustomerCart(userId);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        [HttpGet("quantity")]
        public async Task<IActionResult> GetCartQuantity([FromHeader] string authorization)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _cartRepository.GetCartQuantity(userId);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddToCart([FromHeader] string authorization, 
                                    [FromBody] AddToCartModel model)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _cartRepository.AddToCart(userId, model);
            if(data != "success") 
            {
                return BadRequest(data);
            }
            
            return Ok("Cập nhật giỏ hàng thành công.");
           
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveFromCart([FromHeader] string authorization,
                                    [FromBody] RemoveFromCartModel model)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _cartRepository.Remove(model.CartDetailId);
            if (data != "success")
            {
                return BadRequest(data);
            }

            return Ok("Cập nhật giỏ hàng thành công.");

        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckAndUpdateCart([FromHeader] string authorization)
        {
            var userId = _tokenService.GetUserIdFromToken(authorization);

            var data = await _cartRepository.CheckAndUpdateCart(userId);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }


    }
}
