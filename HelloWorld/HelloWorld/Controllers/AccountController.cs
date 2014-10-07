using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using HelloWorld.Models;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using System.Web.Http;

namespace HelloWorld.Controllers
{
    [Route("api/Account")]
    public class AccountController : ApiController
    {
        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationUserManager UserManager { get; private set; }
        public ApplicationSignInManager SignInManager { get; private set; }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = userModel.UserName,
                Email = userModel.Email
            };

            var result = await UserManager.CreateAsync(user, userModel.Password);
        
            IHttpActionResult errorResult = GetErrorResult(result);

            return errorResult ?? Ok();
        }

        // The Authorize Action is the end point which gets called when you access any
        // protected Web API. If the user is not logged in then they will be redirected to 
        // the Login page. After a successful login you can call a Web API.
        //[HttpGet]
        [Route("Authorize")]
        [AllowAnonymous]
        public async Task Authorize()
        {
            Thread.Sleep(1000);
            var claims = new ClaimsPrincipal(User).Claims.ToArray();
            var identity = new ClaimsIdentity(claims, "Bearer");
            Startup.AuthenticationManager.SignIn(identity);
        }

        [Authorize]
        [HttpGet]
        [Route("someAuthenticatedApi")]
        public IHttpActionResult SomeAuthenticatedApi()
        {
            Thread.Sleep(2000);
            return Ok();
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
