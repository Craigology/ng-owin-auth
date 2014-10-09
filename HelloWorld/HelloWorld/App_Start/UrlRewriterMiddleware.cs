using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin;

namespace HelloWorld.App_Start
{
    public class UrlRewriterMiddleware : OwinMiddleware
    {
        //private static readonly PathString ContentVersioningUrlSegments = PathString.FromUriComponent("/content/v");

        public UrlRewriterMiddleware(OwinMiddleware next)
            : base(next)
        {
        }


        public override async Task Invoke(IOwinContext context)
        {
            //if (context.Request.Path.Value == @"/" || context.Request.Path.Value == "/index.html" ||
            //    context.Request.Path.Value == "/landing" || context.Request.Path.Value == "/home")
            //{
            //}
            await Next.Invoke(context);
            
            if (context.Response.StatusCode == 404)
            {
                context.Response.Redirect(@"/index.html");
            }
        }
    }
}