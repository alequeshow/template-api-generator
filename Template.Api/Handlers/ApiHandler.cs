using Template.Application.Exceptions;
using Template.Contract.Common;
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
        catch (ApplicationErrorException ex)
        {
            return Results.BadRequest(new { errors = ex.Errors });
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

    public static T HandleResult<T>(Result<T> result)
    {
        if(result.IsSuccessful)
            return result.Data!;

        throw new ApplicationErrorException(result.Errors!);
    }
}