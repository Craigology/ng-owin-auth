using System;
using System.Linq;
using System.Security.Claims;
using HelloWorld.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Nancy;
using Nancy.ModelBinding;
using Nancy.Security;
using ClaimTypes = System.IdentityModel.Claims.ClaimTypes;
using System.Collections.Generic;

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
            Get["/register"] = _ => Response.AsRedirect("/");
            Get["/"] = _ => View["index.html"];

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

            Post["api/account/Register"] = _ =>
            {
                var userModel = this.Bind<UserRegistrationModel>();

                var result = _userManager.Create(
                    new ApplicationUser {UserName = userModel.Username, Email = userModel.Email},
                    userModel.Password
                    );

                if (result.Succeeded)
                {
                    return HttpStatusCode.OK;
                }
                else
                {
                    return Response.AsJson(new { Errors = JsonFriendlyError.Build(result.Errors) }, HttpStatusCode.NotAcceptable);
                }
            };
        }

        class JsonFriendlyError
        {
            public string Key { get; private set; }
            public string Error { get; private set; }

            public static JsonFriendlyError[] Build(IEnumerable<string> errors)
            {
                return errors
                    .Select(e =>
                    {
                        var segments = e.Split(new[] { ": " }, StringSplitOptions.RemoveEmptyEntries);
                        return new { Key = segments[0], Error = segments[1] };
                    })
                    .GroupBy(anon => anon.Key)
                    .Select(group => new JsonFriendlyError(group.Key, string.Join("\\n", group.Select(anon => anon.Error))))
                    .ToArray();
            }

            public JsonFriendlyError(string key, string error)
            {
                Key = key;
                Error = error;
            }
        }
    }
}