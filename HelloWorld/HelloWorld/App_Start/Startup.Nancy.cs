using System;
using Autofac;
using HelloWorld.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.Autofac;
using Nancy.Conventions;

namespace HelloWorld
{
    // see https://github.com/NancyFx/Nancy.Bootstrappers.Autofac
    public class HelloWorldBootstrapper : AutofacNancyBootstrapper
    {
        IContainer _container;

        public HelloWorldBootstrapper UseContainer(IContainer containerToUse)
        {
            if (ApplicationContainer != null)
                throw new Exception("The ApplicationContainer already exists! This method should be called before the ApplicationContainer is initialized by Nancy.");

            _container = containerToUse;
            return this;
        }
        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("app", @"app"));
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("scripts", @"scripts"));
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("content", @"content"));
            base.ConfigureConventions(nancyConventions);
        }

        protected override void ApplicationStartup(ILifetimeScope container, IPipelines pipelines)
        {
            // No registrations should be performed in here, however you may
            // resolve things that are needed during application startup.
        }

        protected override void ConfigureApplicationContainer(ILifetimeScope existingContainer)
        {
            // Perform registration that should have an application lifetime
            var builder = new ContainerBuilder();

            builder.RegisterType<ApplicationUserManager>()
                .AsSelf()
                .AsImplementedInterfaces();

            builder.RegisterType<ApplicationSignInManager>()
                .AsSelf()
                .AsImplementedInterfaces();

            builder.Register<IUserStore<ApplicationUser>>(
                c => new UserStore<ApplicationUser>(c.Resolve<ApplicationDbContext>()));

            // Seem necessary to register ApplicationDbContext here rather than ConfigureRequestContainer(), perhaps it is required to early in the request pipeline.
            builder.RegisterType<ApplicationDbContext>()
                .AsSelf()
                .AsImplementedInterfaces();

            builder.Register(c => new IdentityFactoryOptions<ApplicationUserManager>
            {
                DataProtectionProvider =
                    new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("HelloWorld")
            })
            .AsImplementedInterfaces();

            builder.Update(existingContainer.ComponentRegistry);
        }

        protected override void ConfigureRequestContainer(ILifetimeScope container, NancyContext context)
        {
            var builder = new ContainerBuilder();

            builder.Update(container.ComponentRegistry);
        }

        protected override void RequestStartup(ILifetimeScope container, IPipelines pipelines, NancyContext context)
        {
            // No registrations should be performed in here, however you may
            // resolve things that are needed during request startup.
        }

        protected override ILifetimeScope GetApplicationContainer()
        {
            return _container ?? base.GetApplicationContainer();
        }
    }
}