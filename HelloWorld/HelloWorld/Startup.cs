using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Owin;

namespace HelloWorld
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // New code:
            app.Run(async context =>
            {
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("Hello, world.");
            });
        }
    }
}