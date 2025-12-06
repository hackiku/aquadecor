using Aquadecor.Core.Domain.Contracts.Marketing;
using Aquadecor.Core.Domain.Contracts.Marketing.Models;
using Aquadecor.Core.Infrastructure.Marketing.Brevo.Models.Request;
using System.Net.Http.Json;

namespace Aquadecor.Core.Infrastructure.Marketing.Brevo;

public class BrevoService : IBrevoService
{
    private readonly HttpClient _brevoHttpClient;

    public BrevoService(IHttpClientFactory httpClientFactory)
    {
        _brevoHttpClient = httpClientFactory.CreateClient(nameof(BrevoService));
    }

    public async Task AddContactToListAsync(
        AddContactToListModel newContact,
        CancellationToken cancellationToken = default
    )
    {
        int listId = newContact.ContactListType switch
        {
            ContactListType.RegisteredUsers => 12,
            ContactListType.Newsletter => 13,
            _ => throw new ArgumentOutOfRangeException(nameof(newContact.ContactListType), "Unsupported contact list type")
        };

        _ = await _brevoHttpClient.PostAsJsonAsync(
            $"v3/contacts",
            new CreateContactRequestModel()
            {
                Email = newContact.EmailAddress,
                ListIds = [listId]
            },
            cancellationToken
        );

    }
}
