using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>; 

namespace HelloWorld
{
    public static class AngularServerExtension
    {
        public static IAppBuilder UseAngularServer(this IAppBuilder builder, string rootPath, string entryPath)
        {
            var options = new AngularServerOptions()
            {
                FileServerOptions = new FileServerOptions()
                {
                    EnableDirectoryBrowsing = false,
                    FileSystem = new PhysicalFileSystem(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, rootPath))
                },
                EntryPath = new PathString(entryPath)
            };

            builder.UseDefaultFiles(options.FileServerOptions.DefaultFilesOptions);

            return builder.Use<AngularServerMiddleware>(options);
        }
    }

    public class AngularServerOptions
    {
        public FileServerOptions FileServerOptions { get; set; }

        public PathString EntryPath { get; set; }

        public bool Html5Mode
        {
            get
            {
                return EntryPath.HasValue;
            }
        }

        public AngularServerOptions()
        {
            FileServerOptions = new FileServerOptions();
            EntryPath = PathString.Empty;
        }
    }

    public class AngularServerMiddleware
    {
        private readonly AngularServerOptions _options;
        private readonly AppFunc _next;
        private readonly StaticFileMiddleware _innerMiddleware;

        public AngularServerMiddleware(AppFunc next, AngularServerOptions options)
        {
            _next = next;
            _options = options;

            _innerMiddleware = new StaticFileMiddleware(next, options.FileServerOptions.StaticFileOptions);
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            // try to resolve the request with default static file middleware
            await _innerMiddleware.Invoke(environment);

            OwinContext context = new OwinContext(environment);

            // route to root path if the status code is 404
            // and need support angular html5mode
            if (context.Response.StatusCode == 404 && _options.Html5Mode)
            {
                context.Request.Path = _options.EntryPath;
                await _innerMiddleware.Invoke(environment);
            }
        }
    }
}