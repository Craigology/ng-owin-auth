using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(HelloWorld.Startup))]

namespace HelloWorld
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Added a comment here.
            ConfigureAuth(app);
        }
    }
}
