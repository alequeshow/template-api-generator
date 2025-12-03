using Microsoft.Extensions.DependencyInjection;
using Template.Application.Handlers;
using Template.Application.Interfaces.Security;
using Template.Application.Security;
using Template.Application.Validators;
using Template.Core.Extensions;
using Template.Model.Interfaces.Validators;
using Template.Repository.Extensions;

namespace Template.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Handlers
        services.AddScoped<StatusQueryHandler>();
        services.AddScoped<StatusCommandHandler>();
        services.AddScoped<UserQueryHandler>();
        services.AddScoped<UserCommandHandler>();

        // Validators
        services.AddScoped<IUserValidator, UserValidator>();

        // Authentication services        
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IUserRegistrationService, UserRegistrationService>();

        services.AddCoreServices();
        services.AddRepositories();

        return services;
    }
}