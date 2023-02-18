using Microsoft.AspNetCore.Mvc;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
    }
}
