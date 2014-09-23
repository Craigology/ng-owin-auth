using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using HelloWorld.App_Start;
using HelloWorld.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;

namespace HelloWorld
{
	public partial class Startup
	{
		public static IAuthenticationManager AuthenticationManager {get; set; }

	    public void ConfigureIoC(HttpConfiguration configuration, IAppBuilder app)
	    {
            app.Use(async (context, next) =>
            {
                AuthenticationManager = context.Authentication;
                await next.Invoke();
            });
	    
			var builder = new ContainerBuilder();

			builder.RegisterApiControllers(Assembly.GetExecutingAssembly())
                .InstancePerRequest();

            builder.RegisterType<ApplicationDbContext>()
                .AsSelf()
                .InstancePerRequest();

            builder.Register<IUserStore<ApplicationUser>>(c => new UserStore<ApplicationUser>(c.Resolve<ApplicationDbContext>()))
                .InstancePerRequest();

	        builder.RegisterType<ApplicationUserManager>()
	            .AsSelf()
	            .AsImplementedInterfaces()
	            .InstancePerRequest();	            

            builder.RegisterType<ApplicationSignInManager>()
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            builder.Register(c => new IdentityFactoryOptions<ApplicationUserManager>
            {
                DataProtectionProvider = new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("HelloWorld")
            })
            .AsImplementedInterfaces()
            .InstancePerRequest();

            builder
                .RegisterType<HelloMiddleware>()
                .InstancePerRequest();

			// Build the container.
			var container = builder.Build();

            // Create the depenedency resolver.
			var resolver = new AutofacWebApiDependencyResolver(container);
			
            // Configure Web API with the dependency resolver.
            configuration.DependencyResolver = resolver;

            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(configuration);
	    }
	}
}