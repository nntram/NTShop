using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NTShop.Controllers
{
    [Route("home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet("ping")]
        [Authorize]
        public IActionResult Ping()
        {
            return Ok("success");
        }
    }
}
