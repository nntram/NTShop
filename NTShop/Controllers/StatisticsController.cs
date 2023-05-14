using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Models.Filters;
using NTShop.Repositories;
using NTShop.Repositories.Interface;

namespace NTShop.Controllers
{
    [Authorize(Roles = "Admin, Staff")]
    [Route("statistics")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsRepository _statisticsRepository;

        public StatisticsController(IStatisticsRepository statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
        }

        [HttpGet("all-products")]
        public IActionResult GetProductCount()
        {
            var data = _statisticsRepository.GetProductCount();
            return Ok(data);
        }
        [HttpGet("all-customers")]
        public IActionResult GetCustomerCount()
        {
            var data = _statisticsRepository.GetCustomerCount();
            return Ok(data);
        }
        [HttpGet("all-staffs")]
        public IActionResult GetStaffCount()
        {
            var data = _statisticsRepository.GetStaffCount();
            return Ok(data);
        }
        [HttpGet("all-orders")]
        public IActionResult GetOrderCount()
        {
            var data = _statisticsRepository.GetOrderCount();
            return Ok(data);
        }
        [AllowAnonymous]
        [HttpGet("best-selling-products")]
        public IActionResult GetBestSellingProduct([FromQuery]DateFilterModel model)
        {
            var data =  _statisticsRepository.GetBestSellingProduct(model);
            return Ok(data);
        }
        [AllowAnonymous]
        [HttpGet("invoice-statistics")]
        public IActionResult GetInvoiceStatistics([FromQuery] DateFilterModel model, int type)
        {
            var data = _statisticsRepository.GetInvoiceStatistics(model, type);
            return Ok(data);
        }


    }
}
