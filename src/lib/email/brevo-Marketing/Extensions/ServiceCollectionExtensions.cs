using Aquadecor.Core.Domain.Contracts.Marketing;
using Aquadecor.Core.Infrastructure.Marketing.Brevo.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Aquadecor.Core.Infrastructure.Marketing.Brevo.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBrevo(this IServiceCollection services, BrevoServiceConfiguration configuration)
    {
        services.AddHttpClient(nameof(BrevoService), client =>
        {
            client.BaseAddress = new Uri(configuration.BaseUrl);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Add("api-key", configuration.ApiKey);
        });

        services.AddTransient<IBrevoService, BrevoService>();

        return services;
    }
}
