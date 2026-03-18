namespace Template.Application.Extensions;

public static class CommonMapperExtensions
{
    public static List<Contract.Common.Error>? ToErrorsContract(this IEnumerable<Model.ValueObjects.Error> errors)
    {
        if(errors is null)
            return null;

        return [.. errors.Select(e => new Contract.Common.Error(e.Key, e.Message))];
    }

}
