namespace Template.Contract.Common;

public record Result<T>(T? Data);

public record ErrorResult
{
    public bool IsSuccessful { get; init; } = false;
    
    public List<Error>? Errors { get; init; }
}
