using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin;

namespace HelloWorld.App_Start
{
    public class HelloMiddleware : OwinMiddleware
    {
        private readonly ApplicationUserManager _applicationUserManager;

        public HelloMiddleware(OwinMiddleware next, ApplicationUserManager applicationUserManager) : base(next)
        {
            _applicationUserManager = applicationUserManager;
        }

        public override async Task Invoke(IOwinContext context)
        {
            context.Set("ApplicationUserManager", _applicationUserManager);
            await Next.Invoke(context);   
        }
    }
}