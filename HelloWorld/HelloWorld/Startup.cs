using System.Linq;
using Autofac;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using Nancy;
using Owin;
using System.Web.Http;
using System.Net.Http.Formatting;
using Newtonsoft.Json.Serialization;

namespace HelloWorld
{
    public partial class Startup
    {
        internal static IDataProtectionProvider DataProtectionProvider { get; private set; }

        public void Configuration(IAppBuilder app)
        {            
            // Configure Web API for self-host. 
            var config = new HttpConfiguration();

            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

            var builder = new ContainerBuilder();
            var container = builder.Build();

            app.UseStageMarker(PipelineStage.Authenticate);
            ConfigureAuth(app, container);

            app.UseStageMarker(PipelineStage.MapHandler);
            app.UseNancy(nancyOptions =>
            {
                var ctx = new OwinContext(app.Properties);
                AuthenticationManager = ctx.Authentication;

                nancyOptions.Bootstrapper = new HelloWorldBootstrapper().UseContainer(container);

                nancyOptions.PerformPassThrough = context =>
                    context.Response.StatusCode == HttpStatusCode.NotFound ||
                    context.Response.StatusCode == HttpStatusCode.InternalServerError;
            });

            ////// Enable the application to use a cookie to store information for the signed in user
            ////app.UseCookieAuthentication(new CookieAuthenticationOptions
            ////{
            ////    AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
            ////    LoginPath = new PathString("/login")
            ////});

            //// Use a cookie to temporarily store information about a user logging in with a third party login provider
            ////app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            ////// Uncomment the following lines to enable logging in with third party login providers
            //////app.UseMicrosoftAccountAuthentication(
            //////    clientId: "",
            //////    clientSecret: "");

            //////app.UseTwitterAuthentication(
            //////   consumerKey: "",
            //////   consumerSecret: "");

            //////app.UseFacebookAuthentication(
            //////   appId: "",
            //////   appSecret: "");

            //////app.UseGoogleAuthentication();

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
        }
    }
}