using Template.Frontend.Components;
using Template.Frontend.Extensions;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services
    .AddRazorComponents(options =>
        options.DetailedErrors = builder.Environment.IsDevelopment())
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents()
    .AddAuthenticationStateSerialization();

builder.Services.ConfigureServices(configuration);

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
