namespace Template.Contract.Common;

public record Result<T>
{
    public bool IsSuccessful { get; init; }
    public T? Data { get; init; }
    public List<Error>? Errors { get; init; }
}
