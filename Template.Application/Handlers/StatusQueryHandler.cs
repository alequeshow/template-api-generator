using Template.Application.Queries;
using Template.Contract;
using Template.Model.Exceptions;
using Template.Model.Interfaces;

namespace Template.Application.Handlers;

public class StatusQueryHandler(IRepository<Model.Status, string> repository) : IQueryHandler<QuerySingle<Status>, Status>, IQueryHandler<QueryMany<Status>, List<Status>>
{
    public async Task<Status> HandleAsync(QuerySingle<Status> query, CancellationToken cancellationToken = default)
    {
        var model = await repository.GetByIdAsync(query.Id) ?? throw new ResourceNotFoundException();

        return new Status
        {
            Id = model.Id,
            Value = model.Value,
            Description = model.Description,
            TimeStamp = model.TimeStamp
        };
    }

    public async Task<List<Status>> HandleAsync(QueryMany<Status> query, CancellationToken cancellationToken)
    {
        var result = await repository.ListAsync(x => true);

        return [.. result.Select(model => new Status
        {
            Id = model.Id,
            Value = model.Value,
            Description = model.Description,
            TimeStamp = model.TimeStamp
        })];
    }
}