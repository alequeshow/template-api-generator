using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Identity;
using Refit;
using Template.Frontend.Components;
using Template.Frontend.Services.Authentication;
using Template.Frontend.Services.Interfaces;
using Template.Infrastructure.Configuration;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents()
    .AddAuthenticationStateSerialization();

var apiBaseAddress = builder.Configuration["ApiSettings:BaseUrl"]
    ?? throw new InvalidOperationException("API base URL not configured");

builder.Services.AddRefitClient<IAuthenticationApiClient>()
    .ConfigureHttpClient(httpClient =>
    {
        httpClient.BaseAddress = new Uri(apiBaseAddress);        
    })
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        UseCookies = true,
        CookieContainer = new System.Net.CookieContainer()
    });

builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<IdentityUserAccessor>();
builder.Services.AddScoped<IdentityRedirectManager>();
builder.Services.AddScoped<ApiAuthenticationStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider, ApiAuthenticationStateProvider>();

// Configure Identity with custom stores
builder.Services.AddScoped<IUserStore<ApplicationUser>, ApiUserStore>();
builder.Services.AddScoped<SignInManager<ApplicationUser>, ApiSignInManager>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieSettings.CookieAuthenticationScheme;
})
.AddIdentityCookies();

builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    // All api managed
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 0;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
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
