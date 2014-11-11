using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.Owin;

namespace HelloWorld.Identity
{
    // Configure the application sign-in manager which is used in this application.  
    public class ApplicationSignInManager : SignInManager<ApplicationUser, string>
    {
        public ApplicationSignInManager(ApplicationUserManager userManager)                       
            : base(userManager, Startup.AuthenticationManager)
        {
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(ApplicationUser user)
        {
            return user.GenerateUserIdentityAsync((ApplicationUserManager) UserManager);
        }
    }
}