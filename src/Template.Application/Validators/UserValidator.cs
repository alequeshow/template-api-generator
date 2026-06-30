using Template.Model;
using Template.Model.Interfaces;
using Template.Model.Interfaces.Validators;
using Template.Model.ValueObjects;

namespace Template.Application.Validators;

public class UserValidator(IRepository<User, string> repository) : UserModelValidator
{
    protected override async Task<bool> IsEmailUniqueAsync(Email email)
    {
        var exists = await repository.ExistsAsync(u =>
            u.Email.Value == email.Value);
        return !exists;
    }

    protected override async Task<bool> IsEmailUniqueAsync(User model)
    {
        var exists = await repository.ExistsAsync(u =>
            u.Email.Value == model.Email.Value &&
            u.UserId.Identifier != model.UserId.Identifier);
        return !exists;
    }

    protected override async Task<bool> IsUserIdentifierUnchanged(User model)
    {
        var dbUser = await repository.GetByIdAsync(model.Id);

        return dbUser?.UserId.Identifier == model.UserId.Identifier;
    }

    protected override async Task<bool> IsUserIdentifierUniqueAsync(UserIdentifier userId)
    {
        var exists = await repository.ExistsAsync(u =>
            u.UserId.Identifier == userId.Identifier);
        return !exists;
    }
}
