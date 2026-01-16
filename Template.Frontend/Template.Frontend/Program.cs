using Microsoft.AspNetCore.Identity;
using Refit;
using Template.Frontend.Components;
using Template.Frontend.Services.Authentication;
using Template.Frontend.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services
    .AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents()
    .AddAuthenticationStateSerialization();

var apiBaseAddress = builder.Configuration["ApiSettings:BaseUrl"]
    ?? throw new InvalidOperationException("API base URL not configured");

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthTokenForwardingHandler>();
builder.Services.AddHttpClient("BackendAPI", client =>
{
    client.BaseAddress = new Uri(apiBaseAddress);
})
.AddHttpMessageHandler<AuthTokenForwardingHandler>();

builder.Services.AddScoped(sp =>
{
    var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
    var httpClient = httpClientFactory.CreateClient("BackendAPI");
    return RestService.For<IAuthenticationApiClient>(httpClient);
});

builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<IdentityUserAccessor>();
builder.Services.AddScoped<IdentityRedirectManager>();

builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationUserClaimsPrincipalFactory>();

builder.Services.AddScoped<IUserStore<ApplicationUser>, ApiUserStore>();
builder.Services.AddScoped<SignInManager<ApplicationUser>, ApiSignInManager>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ExternalScheme;    
})
.AddIdentityCookies();

builder.Services.AddIdentityCore<ApplicationUser>(options =>
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
builder.Services.AddSingleton<IEmailSender<ApplicationUser>, IdentityNoOpEmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(Template.Frontend.Client._Imports).Assembly);
app.MapAdditionalIdentityEndpoints();

app.Run();
