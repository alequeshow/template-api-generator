using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Template.Api.Configuration;
using Template.Application.Extensions;
using Template.Infrastructure.Configuration;

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

    public static IServiceCollection ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        // Bind JWT settings
        var jwtSettings = configuration.GetSection("Authorization:JwtSettings").Get<JwtSettings>() ?? throw new InvalidOperationException("Authorization:JwtSettings configuration is missing");
        services.Configure<JwtSettings>(configuration.GetSection("Authorization:JwtSettings"));

        var cookieSettings = configuration.GetSection("Authorization:CookieSettings").Get<CookieSettings>() ?? throw new InvalidOperationException("Authorization:CookieSettings configuration is missing");
        services.Configure<CookieSettings>(configuration.GetSection("Authorization:CookieSettings"));

        // Configure Authentication
        var authBuilder = services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;            
        });


        authBuilder.AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });
        
        
        authBuilder.AddCookie(CookieSettings.CookieAuthenticationScheme, options =>
        {
            options.Cookie.Name = cookieSettings.CookieName;
            options.Cookie.HttpOnly = cookieSettings.HttpOnly;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.MaxAge = TimeSpan.FromDays(cookieSettings.MaxAgeInDays);
            options.ExpireTimeSpan = TimeSpan.FromMinutes(cookieSettings.ExpirationMinutes);
            options.SlidingExpiration = true;
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection ConfigureSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
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
        });

        return services;
    }

    private static IServiceCollection ConfigureOptions(this IServiceCollection services)
    {
        services.AddSingleton(provider =>
            provider.GetRequiredService<IOptions<AppConfiguration>>().Value.MongoConfiguration);

        return services;
    }
}