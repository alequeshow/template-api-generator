using Microsoft.Extensions.DependencyInjection;
using Template.Application.Handlers;
using Template.Application.Security;
using Template.Application.Validators;
using Template.Model;
using Template.Model.Interfaces.Security;
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
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IUserRegistrationService, UserRegistrationService>();

        services.AddRepositories();

        return services;
    }
}