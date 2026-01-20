using Microsoft.AspNetCore.Identity;
using Refit;
using Template.Frontend.Services.Authentication;
using Template.Frontend.Services.Interfaces.ApiClients;

namespace Template.Frontend.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor()
         .ConfigureBackendClients(configuration)
         .ConfigureIdentityAuthorization();

        return services;
    }

    public static IServiceCollection ConfigureIdentityAuthorization(this IServiceCollection services)
    {
        services.AddCascadingAuthenticationState();
        services.AddScoped<IdentityUserAccessor>();
        services.AddScoped<IdentityRedirectManager>();
        services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationUserClaimsPrincipalFactory>();
        services.AddScoped<IUserStore<ApplicationUser>, ApiUserStore>();
        services.AddScoped<SignInManager<ApplicationUser>, ApiSignInManager>();

        services.AddAuthentication(options =>
        {
            options.DefaultScheme = IdentityConstants.ApplicationScheme;
            options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
        })
        .AddIdentityCookies();

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            // All api managed
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 0;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;

            // Two-factor authentication settings
            options.Tokens.AuthenticatorTokenProvider = null!;
            options.Tokens.ChangePhoneNumberTokenProvider = null!;
        })
        .AddSignInManager<ApiSignInManager>()
        .AddDefaultTokenProviders();

        // No-op email sender for Identity (Mock email sending)
        services.AddSingleton<IEmailSender<ApplicationUser>, IdentityNoOpEmailSender>();

        return services;
    }

    public static IServiceCollection ConfigureBackendClients(this IServiceCollection services, IConfiguration configuration)
    {
        var apiBaseAddress = configuration["ApiSettings:BaseUrl"]
            ?? throw new InvalidOperationException("API base URL not configured");

        services.AddScoped<AuthTokenForwardingHandler>();
        services.AddHttpClient("BackendAPI", client =>
        {
            client.BaseAddress = new Uri(apiBaseAddress);
        })
        .AddHttpMessageHandler<AuthTokenForwardingHandler>();

        services.AddScopedApiClient<IAuthenticationApiClient>();
        services.AddScopedApiClient<IStatusApiClient>();

        return services;
    }

    private static IServiceCollection AddScopedApiClient<TService>(this IServiceCollection services) where TService : class
    {
        services.AddScoped(sp =>
        {
            var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
            var httpClient = httpClientFactory.CreateClient("BackendAPI");
            return RestService.For<TService>(httpClient);
        });

        return services;
    }
}
