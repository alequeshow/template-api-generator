using Template.Application.Commands;
using Template.Model;

namespace Template.Application.Handlers;

public class StatusCommandHandler : ICommandHandler<Command<Status>, Status>
{
    public Task<Status> HandleAsync(Command<Status> command, CancellationToken cancellationToken = default)
    {
        var result = command.Operation switch
        {
            CommandOperation.Create => command.Value,
            CommandOperation.Update => command.Value,
            CommandOperation.Delete => new Status { Id = command.Value.Id },
            _ => throw new NotSupportedException($"Operation {command.Operation} is not supported.")
        };

        return Task.FromResult(result);
    }
}