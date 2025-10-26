using Template.Api.Extensions.EndpointMappers;

namespace Template.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        app
        .MapAuthenticationEndpoint()
        .MapStatusEndpoint()
        .MapUserEndpoint();

        return app;
    }
}