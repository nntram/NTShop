﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.CreateModels;
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
        [HttpPost("")]
        public async Task<IActionResult> Create([FromForm] CustomerCreateModel model)
        {
            var data = await _customerRepository.CreatetAsync(model);
            return Ok(data);
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> IsUsernameExist([FromRoute] string username)
        {
            var data = await _customerRepository.IsUsernameExist(username);
            return Ok(data);
        }

    }
}
