using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCard()
        {
            var data = await _productRepository.GetAllCardAsync();
            return Ok(data);
        }


        [HttpGet("get")]
        public async Task<IActionResult> GetCard(int size = int.MaxValue)
        {
            var data = await _productRepository.GetCardAsync(size);
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
    }
}
