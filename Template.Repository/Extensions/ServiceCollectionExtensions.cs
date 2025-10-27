using Microsoft.Extensions.DependencyInjection;
using Template.DatabaseFactory.Mongo.Extensions;
using Template.Model;

namespace Template.Repository.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services
        .ConfigureMongoDatabase()
        .AddMongoRepository<Status>()
        .AddMongoRepository<User>()
        .AddMongoRepository<UserAccessInfo>();

        return services;
    }    
}