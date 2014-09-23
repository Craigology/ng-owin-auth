using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Web.Http.Results;
using HelloWorld.Models;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Newtonsoft.Json;

namespace HelloWorld.Controllers
{
    [Route("api/Account")]
    public class AccountController : ApiController
    {
        private ApplicationDbContext _ctx;
        private ApplicationUserManager _userManager;
        //public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        //public AccountController()
        //{
        //    _ctx = new ApplicationDbContext();
        //    _userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(_ctx));
        //}

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager;
            }
            private set
            {
                _userManager = value;
            }
        }

        private ApplicationSignInManager _signInManager;

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager;
            }
            private set { _signInManager = value; }
        }

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

            var result = await _userManager.CreateAsync(user, userModel.Password);
        
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
            var claims = new ClaimsPrincipal(User).Claims.ToArray();
            var identity = new ClaimsIdentity(claims, "Bearer");
            Startup.AuthenticationManager.SignIn(identity);
        }

        [Authorize]
        [HttpGet]
        [Route("Foo")]
        public IHttpActionResult Foo()
        {
            return Ok("Yeah!");
        }

        //[AllowAnonymous]
        //[Route("Login")]
        //public async Task<IHttpActionResult> Login(UserModel userModel)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var user = new ApplicationUser
        //    {
        //        UserName = userModel.UserName
        //    };

        //    var result = await _userManager.FindAsync(userModel.UserName, userModel.Password);

        //    IHttpActionResult errorResult = GetErrorResult(result);

        //    return errorResult ?? Ok();            
        //}


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
