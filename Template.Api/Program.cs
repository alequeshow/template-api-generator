using Template.Api.Configuration;
using Template.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppConfiguration>(builder.Configuration);

builder.Services.AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .ConfigureServices();
    
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapEndpoints();

app.UseHttpsRedirection();

app.Run();