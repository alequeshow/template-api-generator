using Template.Model.ValueObjects;

namespace Template.Model.Interfaces.Validations;

public abstract class UserModelValidation : IUserValidation
{
    public async Task<IEnumerable<Error>?> ValidadeForAddAsync(User model)
    {
        var errors = new List<Error>();

        if (!Email.IsValid(model.Email))
        {
            errors.Add(new Error("InvalidEmail", Email.ValidationMessage));
        }
        else if (!await IsEmailUniqueAsync(model.Email))
        {
            errors.Add(new Error("EmailNotUnique", "The provided email is already in use."));
        }

        if (!UserIdentifier.IsValid(model.UserId))
        {
            errors.Add(new Error("InvalidUserId", UserIdentifier.ValidationMessage));
        }
        else if (!await IsUserIdentifierUniqueAsync(model.UserId))
        {
            errors.Add(new Error("UserIdNotUnique", "The provided user identification is already in use."));
        }

        if(!PersonName.IsValid(model.Name))
        {
            errors.Add(new Error("InvalidPersonName", PersonName.ValidationMessage));
        }

        return errors.Count > 0 ? errors : null;
    }

    public async Task<IEnumerable<Error>?> ValidadeForUpdateAsync(User model)
    {
        var errors = new List<Error>();

        if (!Email.IsValid(model.Email))
        {
            errors.Add(new Error("InvalidEmail", Email.ValidationMessage));
        }
        else if (!await IsEmailUniqueAsync(model))
        {
            errors.Add(new Error("EmailNotUnique", "The provided email is already in use."));
        }

        if (!UserIdentifier.IsValid(model.UserId))
        {
            errors.Add(new Error("InvalidUserId", UserIdentifier.ValidationMessage));
        }
        else if (!await IsUserIdentifierUnchanged(model))
        {
            errors.Add(new Error("ChangedUserIdentifier", "The user identification cannot be changed."));
        }

        if (!PersonName.IsValid(model.Name))
        {
            errors.Add(new Error("InvalidPersonName", PersonName.ValidationMessage));
        }

        return errors.Count > 0 ? errors : null;
    }

    protected abstract Task<bool> IsEmailUniqueAsync(Email email);

    protected abstract Task<bool> IsUserIdentifierUniqueAsync(UserIdentifier userId);

    protected abstract Task<bool> IsEmailUniqueAsync(User model);

    protected abstract Task<bool> IsUserIdentifierUnchanged(User model);
}
