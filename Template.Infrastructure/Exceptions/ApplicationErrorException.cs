using Template.Contract.Common;

namespace Template.Infrastructure.Exceptions;

public class ApplicationErrorException(List<Error> errors) : Exception
{
    public List<Error>? Errors { get; set; } = errors;
}
