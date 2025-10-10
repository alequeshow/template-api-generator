using Template.Application.Commands;
using Template.Contract;
using Template.Model.Interfaces;

namespace Template.Application.Handlers;

public class StatusCommandHandler(IRepository<Model.Status, string> repository) : ICommandHandler<Command<Status>, Status>
{
    public async Task<Status> HandleAsync(Command<Status> command, CancellationToken cancellationToken = default)
    {
        var model = new Model.Status
        {
            Id = command.Value.Id!,
            Value = command.Value.Value,
            Description = command.Value.Description,
            TimeStamp = command.Value.TimeStamp
        };

        switch (command.Operation)
        {
            case CommandOperation.Create:
                await repository.AddAsync(model);
                command.Value.Id = model.Id;
                break;
            case CommandOperation.Update:
                await repository.UpdateAsync(model);
                break;
            case CommandOperation.Delete:
                await repository.DeleteAsync(model.Id);
                break;
            default:
                throw new NotSupportedException($"Operation {command.Operation} is not supported.");
        }

        return command.Value;
    }
}