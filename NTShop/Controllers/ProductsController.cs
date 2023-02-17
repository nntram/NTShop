using Microsoft.AspNetCore.Mvc;

namespace NTShop.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
