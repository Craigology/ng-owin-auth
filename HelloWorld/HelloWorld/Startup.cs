using System.Linq;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System.Web.Http;
using System.Net.Http.Formatting;
using Newtonsoft.Json.Serialization;

namespace HelloWorld
{
    public partial class Startup
    {
        //public const string ExternalCookieAuthenticationType = CookieAuthenticationDefaults.AuthenticationType;
        //public const string ExternalOAuthAuthenticationType = "ExternalToken";

        internal static IDataProtectionProvider DataProtectionProvider { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            // Configure Web API for self-host. 
            HttpConfiguration config = new HttpConfiguration();

            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { action = RouteParameter.Optional, id = RouteParameter.Optional }
            );

            ConfigureIoC(config, app);
            ConfigureAuth(app);

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

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

        //public void ConfigureOAuth(IAppBuilder app)
        //{
        //    OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
        //    {
        //        AllowInsecureHttp = true,
        //        TokenEndpointPath = new PathString("/token"),
        //        AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
        //        Provider = new IssAuthorizationServerProvider()
        //    };

        //    // Token Generation
        //    app.UseOAuthAuthorizationServer(OAuthServerOptions);
        //    app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        //}
    }
}