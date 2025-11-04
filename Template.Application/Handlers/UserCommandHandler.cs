using Template.Application.Commands;
using Template.Application.Extensions;
using Template.Contract;
using Template.Contract.Common;
using Template.Model.Exceptions;
using Template.Model.Interfaces;
using Template.Model.Interfaces.Validators;
using Template.Model.ValueObjects;

namespace Template.Application.Handlers;

public class UserCommandHandler(
    IRepository<Model.User, string> repository,
    IUserValidator userValidation) : ICommandHandler<Command<User>, User>
{
    public async Task<Result<User>> HandleAsync(Command<User> command, CancellationToken cancellationToken = default)
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

                var addResult = await userValidation.ValidateForAddAsync(model);

                if (addResult is not null)
                {
                    return new Result<User>
                    {
                        IsSuccessful = false,
                        Errors = addResult.ToErrorsContract()
                    };
                }

                await repository.AddAsync(model);

                command.Value.Id = model.Id;
                break;
            case CommandOperation.Update:

                var existingUser = await repository.GetByIdAsync(command.Value.Id!) ?? throw new ResourceNotFoundException();

                existingUser.UserId = new UserIdentifier(command.Value.UserId);
                existingUser.Name = new PersonName(command.Value.FirstName, command.Value.LastName);
                existingUser.Email = new Email(command.Value.Email);

                if (existingUser.ActiveInfo.IsActive != command.Value.IsActive)
                {
                    if (command.Value.IsActive)
                    {
                        existingUser.ActiveInfo.Reactivate();
                    }
                    else
                    {
                        existingUser.ActiveInfo.Deactivate();
                    }
                }

                var updateResult = await userValidation.ValidateForUpdateAsync(existingUser);

                if (updateResult is not null)
                {
                    return new Result<User>
                    {
                        IsSuccessful = false,
                        Errors = updateResult.ToErrorsContract()
                    };
                }

                await repository.UpdateAsync(existingUser);

                break;
            case CommandOperation.Delete:
                await repository.DeleteAsync(command.Value.Id!);
                break;
            default:
                throw new NotSupportedException($"Operation {command.Operation} is not supported.");
        }

        return new Result<User>
        {
            Data = command.Value,
            IsSuccessful = true
        };
    }
}