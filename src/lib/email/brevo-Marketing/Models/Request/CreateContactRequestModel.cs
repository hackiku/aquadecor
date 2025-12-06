namespace Aquadecor.Core.Infrastructure.Marketing.Brevo.Models.Request;

public record CreateContactRequestModel
{
    public string Email { get; set; }
    public List<int> ListIds { get; set; }
}
