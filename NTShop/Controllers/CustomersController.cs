using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Repositories.Interface;
namespace NTShop.Controllers
{
    [ApiController]
    [Route("customers")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomersController(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _customerRepository.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var data = await _customerRepository.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        
    }
}
