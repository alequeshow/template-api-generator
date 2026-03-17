using System.Net.Http.Headers;

namespace Template.Frontend.Services.Authentication;

public class AuthTokenForwardingHandler(
    IHttpContextAccessor httpContextAccessor,
    ILogger<AuthTokenForwardingHandler> logger) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.HttpContext;

        // Forward custom x-authorization header to proper authorization header
        if (request?.Headers.Count() > 0)
        {
            var userToken = request.Headers.FirstOrDefault(c => c.Key.ToLowerInvariant().Equals("x-authorization")).Value.FirstOrDefault();

            if (!string.IsNullOrEmpty(userToken))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", userToken);
                request.Headers.Remove("x-authorization");
            }
        }

        if(request?.Headers.Authorization is null)
        {
            var contextToken = httpContext?.User.GetAuthToken();

            if (!string.IsNullOrEmpty(contextToken))
            {
                request!.Headers.Authorization = new AuthenticationHeaderValue("Bearer", contextToken);
            }
        }

        var response = await base.SendAsync(request!, cancellationToken);

        if ((int)response.StatusCode > 399)
        {
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogDebug("Error while forwarding request: {ErrorContent}", errorContent);
        }        

        return response;
    }
}