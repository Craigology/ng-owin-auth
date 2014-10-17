using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace HelloWorld.Identity
{
    public class ApplicationPasswordValidator : PasswordValidator
    {
        public ApplicationPasswordValidator()
        {
            RequiredLength = 6;
            RequireNonLetterOrDigit = false;
            RequireDigit = true;
            RequireLowercase = true;
            RequireUppercase = true;
        }

        public override async Task<IdentityResult> ValidateAsync(string item)
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
                    yield return string.Format("password: {0}.", individualError.TrimEnd('.'));
                }
            }
        }
    }
}