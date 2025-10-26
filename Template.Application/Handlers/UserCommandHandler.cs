using Template.Application.Commands;
using Template.Contract;
using Template.Model.Exceptions;
using Template.Model.Interfaces;
using Template.Model.ValueObjects;

namespace Template.Application.Handlers;

public class UserCommandHandler(IRepository<Model.User, string> repository) : ICommandHandler<Command<User>, User>
{
    public async Task<User> HandleAsync(Command<User> command, CancellationToken cancellationToken = default)
    {
        switch (command.Operation)
        {
            case CommandOperation.Create:

                var model = new Model.User
                {
                    Id = command.Value.Id!,
                    UserId = new UserIdentifier(command.Value.UserId),
                    Name = new PersonName(command.Value.FirstName, command.Value.LastName),
                    Email = new Email(command.Value.Email),
                    ActiveInfo = new ActiveInfo()
                };

                await repository.AddAsync(model);

                command.Value.Id = model.Id;
                break;
            case CommandOperation.Update:

                var existingUser = await repository.GetByIdAsync(command.Value.Id!) ?? throw new ResourceNotFoundException();

                existingUser.Name = new PersonName(command.Value.FirstName, command.Value.LastName);
                existingUser.Email = new Email(command.Value.Email);

                await repository.UpdateAsync(existingUser);

                break;
            case CommandOperation.Delete:
                await repository.DeleteAsync(command.Value.Id!);
                break;
            default:
                throw new NotSupportedException($"Operation {command.Operation} is not supported.");
        }

        return command.Value;
    }
}