using Template.Contract.Common;

namespace Template.Application.Interfaces.Handlers;

public interface ICommandHandler<TCommand, TResult>
{
    Task<Result<TResult>> HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}