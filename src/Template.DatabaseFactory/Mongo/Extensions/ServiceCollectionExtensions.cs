using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using Template.DatabaseFactory.Mongo.Configuration;
using Template.Model;
using Template.Model.Interfaces;

namespace Template.DatabaseFactory.Mongo.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection ConfigureMongoDatabase(this IServiceCollection services)
    {
        services.AddSingleton<IMongoClient>(provider => 
        {
            var connectionString = provider.GetRequiredService<MongoConfiguration>().ConnectionString;
            var settings = MongoClientSettings.FromConnectionString(connectionString);
            
            return new MongoClient(settings);
        });
        
        services.AddScoped(provider =>
        {
            var client = provider.GetRequiredService<IMongoClient>();
            var mongoUrl = new MongoUrl(provider.GetRequiredService<MongoConfiguration>().ConnectionString);
            return client.GetDatabase(mongoUrl.DatabaseName);
        });

        if (!BsonClassMap.IsClassMapRegistered(typeof(EntityModel)))
        {
            BsonClassMap.RegisterClassMap<EntityModel>(cm =>
            {
                cm.AutoMap();
                cm.MapIdProperty(x => x.Id)
                  .SetIdGenerator(StringObjectIdGenerator.Instance)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }

        return services;
    }


    public static IServiceCollection AddMongoRepository<T>(this IServiceCollection services) where T : EntityModel
    {
        services.AddScoped<IRepository<T, string>>(provider =>
            new MongoRepository<T>(provider.GetRequiredService<IMongoDatabase>(), typeof(T).Name)
        );

        return services;
    }
}