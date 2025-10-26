using Microsoft.OpenApi.Models;
using Template.Api.Configuration;
using Template.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppConfiguration>(builder.Configuration);

builder.Services.AddEndpointsApiExplorer()
    .AddSwaggerGen(options =>
    {
        // Add JWT Bearer authentication to Swagger
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter your JWT token in the format: Bearer {your token}"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Template API",
            Version = "v1",
            Description = "API with JWT Bearer Authentication"
        });
    })
    .ConfigureAuthentication(builder.Configuration)
    .ConfigureServices();
    
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Template API v1");

        options.EnablePersistAuthorization();
    });
}

app.MapEndpoints();

app.UseHttpsRedirection();

app.Run();