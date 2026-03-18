using Template.Model.ValueObjects;

namespace Template.Model.Interfaces.Validators;

public interface IUserValidator
{
    Task<IEnumerable<Error>?> ValidateForAddAsync(User model);

    Task<IEnumerable<Error>?> ValidateForUpdateAsync(User model);
}
