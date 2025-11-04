using Template.Contract.Common;

namespace Template.Application.Exceptions;

public class ApplicationErrorException : Exception
{
    public ApplicationErrorException(List<Error> errors)
    {
        Errors = errors;
    }

    public List<Error>? Errors { get; set; }
}
