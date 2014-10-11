using System.Linq;
using System.Security.Claims;
using Microsoft.Owin.Security;
using Nancy;
using Nancy.Security;
using ClaimTypes = System.IdentityModel.Claims.ClaimTypes;

namespace HelloWorld.Controllers
{
    public class AccountNancyModule : NancyModule
    {
        private readonly ApplicationUserManager _userManager;

        public AccountNancyModule(ApplicationUserManager userManager)
        {
            _userManager = userManager;

            Get["/landing"] = _ => Response.AsRedirect("/");
            Get["/home"] = _ => Response.AsRedirect("/");
            Get["/"] = _ => View["index.html"];

            Post["Authorize"] = _ =>
            {
                // (From the WebAPI template...)
                // The Authorize Action is the end point which gets called when you access any
                // protected Web API. If the user is not logged in then they will be redirected to 
                // the Login page. After a successful login you can call a Web API.
                var user = Context.GetMSOwinUser();
                var claims = new ClaimsPrincipal(user).Claims.ToArray();
                var identity = new ClaimsIdentity(claims, "Bearer");

                IAuthenticationManager authenticationManager = Context.GetAuthenticationManager();
                authenticationManager.SignIn(identity);

                return HttpStatusCode.OK;
            };

            Get["/SomeAuthenticatedApi"] = _ =>
            {
                this.RequiresMSOwinAuthentication();
                this.RequiresSecurityClaims(claims => claims.Any(claim => claim.Type == ClaimTypes.Email));

                var principal = Context.GetMSOwinUser();

                // http://dhickey.ie/post/2014/01/04/Introducing-NancyMSOwinSecurity.aspx
                // [Jan14] "Note: This package doesn't replace nor integrate with the exisiting nancy authentication and authorization infrasctructure (IUserIdentity). We're currently considering the best way to proceed on this."
                var u = Context.CurrentUser;

                return HttpStatusCode.OK;
            };
        }
    }
}