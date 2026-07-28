using Microsoft.AspNetCore.Mvc;

namespace Reznik_WebApp.Server.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
