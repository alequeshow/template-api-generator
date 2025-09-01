using Microsoft.Extensions.DependencyInjection;
using Template.Application.Handlers;

namespace Template.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<StatusQueryHandler>();
        services.AddScoped<StatusCommandHandler>();

        return services;
    }
}