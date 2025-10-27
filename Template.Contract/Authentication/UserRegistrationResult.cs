using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template.Contract.Authentication;

/// <summary>
/// Represents the result of a user registration attempt.
/// </summary>
public class RegistrationResult
{
    public bool IsSuccessful { get; set; }
    public string? UserId { get; set; }
    public string? Message { get; set; }
    public UserRegistrationStatus? Status { get; set; }
}
