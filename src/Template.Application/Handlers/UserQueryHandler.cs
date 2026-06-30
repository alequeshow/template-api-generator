using Template.Application.Interfaces.Handlers;
using Template.Application.Queries;
using Template.Contract;
using Template.Infrastructure.Exceptions;
using Template.Model.Interfaces;

namespace Template.Application.Handlers;

public class UserQueryHandler(IRepository<Model.User, string> repository) : IQueryHandler<QuerySingle<User>, User>, IQueryHandler<QueryMany<User>, List<User>>
{
    public async Task<User> HandleAsync(QuerySingle<User> query, CancellationToken cancellationToken = default)
    {
        var model = await repository.GetByIdAsync(query.Id) ?? throw new ResourceNotFoundException();

        return new User
        {
            Id = model.Id,
            UserId = model.UserId.Identifier,
            FirstName = model.Name.FirstName,
            LastName = model.Name.LastName,
            Email = model.Email.Value,
            IsActive = model.ActiveInfo.IsActive,
            IsActiveFrom = model.ActiveInfo.IsActiveFrom,
            DeactivatedSince = model.ActiveInfo.DeactivatedSince,
        };
    }

    public async Task<List<User>> HandleAsync(QueryMany<User> query, CancellationToken cancellationToken)
    {
        var result = await repository.ListAsync(x => true);

        return [.. result.Select(model => new User
        {
            Id = model.Id,
            UserId = model.UserId.Identifier,
            FirstName = model.Name.FirstName,
            LastName = model.Name.LastName,
            Email = model.Email.Value,
            IsActive = model.ActiveInfo.IsActive,
            IsActiveFrom = model.ActiveInfo.IsActiveFrom,
            DeactivatedSince = model.ActiveInfo.DeactivatedSince,
        })];
    }
}