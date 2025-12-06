using Aquadecor.Core.Infrastructure.Email.Gmail.Configuration;
using Microsoft.Extensions.Options;
using Aquadecor.Core.Domain.Contracts.Email;
using Aquadecor.Core.Infrastructure.Email.Common;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace Aquadecor.Core.Infrastructure.Email.Gmail;

public class EmailService : IEmailService
{
    private readonly GmailSmtpConfiguration _gmailSmtpConfig;
    private readonly TemplateRenderer _templateRenderer;
    public EmailService(IOptions<GmailSmtpConfiguration> options, TemplateRenderer templateRenderer)
    {
        _gmailSmtpConfig = options.Value ?? throw new ArgumentNullException(nameof(options));
        _templateRenderer = templateRenderer;
    }
    public async Task SendAsync(string toEmail, string plainTextContent, string htmlContent, string subject)
    {
        bool isBodyHtml = !string.IsNullOrEmpty(htmlContent);

        string emailMessage = isBodyHtml 
            ? htmlContent 
            : plainTextContent;

        using var client = new SmtpClient();

        await client.ConnectAsync(_gmailSmtpConfig.Host, _gmailSmtpConfig.Port,true);
        await client.AuthenticateAsync(_gmailSmtpConfig.Username,_gmailSmtpConfig.Password);
        MimeMessage message = new();

        BodyBuilder bodyBuilder = new();

        if (isBodyHtml)
            bodyBuilder.HtmlBody = htmlContent;
        else
            bodyBuilder.TextBody = plainTextContent;

        message.Body = bodyBuilder.ToMessageBody();
        message.Subject = subject;

        message.To.Add(new MailboxAddress(toEmail, toEmail));
        message.From.Add(new MailboxAddress("Aquadecor", _gmailSmtpConfig.Username));

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SendUsingTemplateAsync(string toEmail, 
        string subject, 
        EmailTemplateType templateType, 
        Dictionary<string, dynamic> templateParameters)
    {

        string emailBody = await _templateRenderer.RenderHtmlByTemplateTypeAsync(templateType, templateParameters);

        await SendAsync(toEmail,
            plainTextContent: string.Empty,
            htmlContent: emailBody,
            subject);
    }
}