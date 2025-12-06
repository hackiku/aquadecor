namespace Aquadecor.Core.Infrastructure.Marketing.Brevo.Models;

public record BrevoServiceConfiguration
{
    public string BaseUrl { get; init; }
    public string ApiKey { get; init; }
}
