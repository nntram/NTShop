using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}
