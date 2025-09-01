using Template.Model.Exceptions;

namespace Template.Api.Handlers;

public class ApiHandler
{
    public static async Task<IResult> HandleEndpointAsync(Func<Task<IResult>> handler)
    {
        try
        {
            return await handler();
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            // TODO: Configure Logging
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}