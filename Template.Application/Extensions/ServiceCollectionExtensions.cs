using Microsoft.Extensions.DependencyInjection;
using Template.Application.Handlers;
using Template.Repository.Extensions;

namespace Template.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<StatusQueryHandler>();
        services.AddScoped<StatusCommandHandler>();
        services.AddScoped<UserQueryHandler>();
        services.AddScoped<UserCommandHandler>();

        services.AddRepositories();

        return services;
    }
}