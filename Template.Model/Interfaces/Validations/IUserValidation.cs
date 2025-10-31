using Template.Model.ValueObjects;

namespace Template.Model.Interfaces.Validations;

public interface IUserValidation
{
    Task<IEnumerable<Error>?> ValidadeForAddAsync(User model);

    Task<IEnumerable<Error>?> ValidadeForUpdateAsync(User model);
}
