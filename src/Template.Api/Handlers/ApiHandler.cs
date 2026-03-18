using Template.Contract.Common;
using Template.Infrastructure.Exceptions;

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
            return Results.BadRequest(MapErrorResult(ex.Errors));
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(MapErrorResult(ex.Message));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(MapErrorResult(ex.Message));
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
        return result.Data!;
    }

    public static ErrorResult MapErrorResult(string errorMessage, string code = "")
    {
        return new ErrorResult
        {
            Errors = [ new(code, errorMessage) ]
        };
    }

    public static ErrorResult MapErrorResult(IEnumerable<Error>? errors)
    {
        if (errors is null)
            return new ErrorResult();

        return new ErrorResult
        {
            Errors = [.. errors]
        };
    }
}