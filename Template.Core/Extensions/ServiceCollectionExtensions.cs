using Microsoft.Extensions.DependencyInjection;
using Template.Core.Interfaces.Security;
using Template.Core.Security;

namespace Template.Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services)
    {
        // Security services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICookieService, CookieService>();        

        return services;
    }
}