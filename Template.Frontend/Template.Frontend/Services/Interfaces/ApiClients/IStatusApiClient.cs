using Refit;
using Template.Contract;

namespace Template.Frontend.Services.Interfaces.ApiClients;

public interface IStatusApiClient
{
    [Get("/status")]
    Task<IReadOnlyCollection<Status>> GetStatusAsync();

    [Post("/status")]
    Task<Status> AddStatusAsync(Status userCredentials);

    [Get("/status/{id}")]
    Task<Status> GetStatusAsync(string id);

    [Put("/status/{id}")]
    Task<Status> UpdateStatusAsync(string id, Status status);

    [Delete("/status/{id}")]
    Task<Status> DeleteStatusAsync(string id);
}
