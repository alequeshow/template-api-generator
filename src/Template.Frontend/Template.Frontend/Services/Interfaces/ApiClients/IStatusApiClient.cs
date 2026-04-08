using Refit;
using Template.Contract;

namespace Template.Frontend.Services.Interfaces.ApiClients;

public interface IStatusApiClient
{
    [Get("/status")]
    Task<IReadOnlyCollection<Status>> GetStatusAsync();

    [Post("/status")]
    Task<string> AddStatusAsync(Status status);

    [Get("/status/{id}")]
    Task<Status> GetStatusAsync(string id);

    [Put("/status/{id}")]
    Task UpdateStatusAsync(string id, Status status);

    [Delete("/status/{id}")]
    Task DeleteStatusAsync(string id);
}
