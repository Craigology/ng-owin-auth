using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace HelloWorld.Providers
{
    public class IssAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // This must be set in the Nancy Owin extensions, because leaving this here incurs an already added exception.
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            var applicationUserManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

            var user = await applicationUserManager.FindAsync(context.UserName, context.Password);
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));
            identity.AddClaim(new Claim(ClaimTypes.Sid, user.Id));

            var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
            context.Validated(ticket);

            context.OwinContext.Authentication.SignIn(identity);
        }

        public override async Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            var userName = context.Identity.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
            if (userName != null)
            {
                context.AdditionalResponseParameters.Add("userName", userName.Value);
            }
            var emailClaim = context.Identity.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim != null)
            {
                context.AdditionalResponseParameters.Add("email", emailClaim.Value);                
            }
        }
    }
}
