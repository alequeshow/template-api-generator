namespace Template.Application.Queries;

public record QueryMany<T>
{
    public T? Filter { get; set; }
}