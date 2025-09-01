namespace Template.Application.Commands;

public record Command<T>(T Value, CommandOperation Operation);