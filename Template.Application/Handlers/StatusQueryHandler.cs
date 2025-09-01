using Template.Application.Queries;
using Template.Model;

namespace Template.Application.Handlers;

public class StatusQueryHandler : IQueryHandler<QuerySingle<Status>, Status>, IQueryHandler<QueryMany<Status>, List<Status>>
{
    public Task<Status> HandleAsync(QuerySingle<Status> query, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new Status
        {
            Id = query.Id,
            Value = "OK",
            Description = "Test Application",
            TimeStamp = DateTime.Now
        });
    }

    public Task<List<Status>> HandleAsync(QueryMany<Status> query, CancellationToken cancellationToken)
    {
        return Task.FromResult(new List<Status>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Value = "OK",
                Description = "Test Application #2",
                TimeStamp = DateTime.Now
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Value = "Fail",
                Description = "Test Application #1",
                TimeStamp = DateTime.Now.AddDays(-1)
            }
        });
    }
}