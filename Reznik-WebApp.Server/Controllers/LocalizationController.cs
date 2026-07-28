using Microsoft.AspNetCore.Mvc;

namespace Reznik_WebApp.Server.Controllers
{
    public class LocalizationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
