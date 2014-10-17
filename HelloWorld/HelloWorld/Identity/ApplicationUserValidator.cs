using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace HelloWorld.Identity
{
    public class ApplicationUserValidator : UserValidator<ApplicationUser>
    {
        public ApplicationUserValidator(UserManager<ApplicationUser, string> manager)
            : base(manager)
        {
            AllowOnlyAlphanumericUserNames = false;
            RequireUniqueEmail = true;
        }

        public override async Task<IdentityResult> ValidateAsync(ApplicationUser item)
        {
            var result = await base.ValidateAsync(item);

            return result.Succeeded ? result : IdentityResult.Failed(RepackageErrorStrings(result.Errors).ToArray());
        }

        private IEnumerable<string> RepackageErrorStrings(IEnumerable<string> originalErrors)
        {
            foreach (var stringOfErrors in originalErrors)
            {
                foreach (var individualError in stringOfErrors.Split(new[] { ". " }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (individualError.Contains("Email"))
                    {
                        yield return string.Format("email: {0}.", individualError.TrimEnd('.'));
                    }
                    else
                    {
                        yield return string.Format("username: {0}.", individualError.TrimEnd('.'));
                    }
                }
            }
        }
    }
}