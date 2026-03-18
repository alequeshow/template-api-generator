using Template.Application.Commands;
using Template.Application.Interfaces.Handlers;
using Template.Contract;
using Template.Contract.Common;
using Template.Infrastructure.Exceptions;
using Template.Model.Interfaces;

namespace Template.Application.Handlers;

public class StatusCommandHandler(IRepository<Model.Status, string> repository) : ICommandHandler<Command<Status>, Status>
{
    public async Task<Result<Status>> HandleAsync(Command<Status> command, CancellationToken cancellationToken = default)
    {
        switch (command.Operation)
        {
            case CommandOperation.Create:
                
                var model = new Model.Status
                {
                    Id = null!,
                    Value = command.Value.Value,
                    Description = command.Value.Description,
                    TimeStamp = command.Value.TimeStamp
                };

                await repository.AddAsync(model);

                command.Value.Id = model.Id;

                break;
            case CommandOperation.Update:
                
                var existingStatus = await repository.GetByIdAsync(command.Value.Id!) ?? throw new ResourceNotFoundException();

                existingStatus.Value = command.Value.Value;
                existingStatus.Description = command.Value.Description;
                existingStatus.TimeStamp = command.Value.TimeStamp;

                await repository.UpdateAsync(existingStatus);

                break;
            case CommandOperation.Delete:

                await repository.DeleteAsync(command.Value.Id!);

                break;
            default:
                throw new NotSupportedException($"Operation {command.Operation} is not supported.");
        }

        return new Result<Status>(command.Value);
    }
}