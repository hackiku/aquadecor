using Aquadecor.Core.Domain.Contracts.Email;
using Aquadecor.Core.Infrastructure.Email.Sendgrid.Configuration;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Aquadecor.Core.Infrastructure.Email.Sendgrid;

public class EmailService : IEmailService
{
    private readonly SendgridConfiguration _sendGridConfiguration;
    private readonly SendGridClient _sendGridClient;
    public EmailService(IOptions<SendgridConfiguration> options)
    {
        _sendGridConfiguration = options.Value ?? throw new ArgumentNullException("Email sender can not be initialized.");
        _sendGridClient = new SendGridClient(_sendGridConfiguration.ApiKey);
    }

    public async Task SendAsync(string toEmail, string plainTextContent, string htmlContent, string subject)
    {
        var preparedEmail = MailHelper.CreateSingleEmail(from: new EmailAddress(_sendGridConfiguration.SenderEmail), 
                                                         to: new EmailAddress(toEmail),
                                                         subject,
                                                         plainTextContent,
                                                         htmlContent);

        var response = await _sendGridClient.SendEmailAsync(preparedEmail);
        if (!response.IsSuccessStatusCode) throw new ArgumentException("Failed while sending email.");
    }

    public Task SendUsingTemplateAsync(string toEmail, string subject, EmailTemplateType templateType, Dictionary<string, object> templateParameters)
    {
        throw new NotImplementedException();
    }
}
