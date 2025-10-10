using Microsoft.Extensions.Options;
using Template.Api.Configuration;
using Template.Application.Extensions;

namespace Template.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services)
    {
        services
        .ConfigureOptions()
        .AddApplicationServices();

        return services;
    }

    private static IServiceCollection ConfigureOptions(this IServiceCollection services)
    {
        services.AddSingleton(provider =>
            provider.GetRequiredService<IOptions<AppConfiguration>>().Value.MongoConfiguration);

        return services;
    }
}