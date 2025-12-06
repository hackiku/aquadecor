using Aquadecor.Core.Domain.Contracts.Email;
using System.Collections.Immutable;

namespace Aquadecor.Core.Infrastructure.Email.Common.Templates.Metadata;

public class TemplatesMapper
{
    private readonly Dictionary<EmailTemplateType, TemplateMetadata> _templatesMapping;
    public TemplatesMapper()
    {
        _templatesMapping = new Dictionary<EmailTemplateType, TemplateMetadata>()
        {
            { EmailTemplateType.AccountVerification,new TemplateMetadata("AccountConfirmationTemplate",ImmutableArray.Create("callBackUrl")) },
            { EmailTemplateType.ForgotPassword, new TemplateMetadata("PasswordResetTemplate", ImmutableArray.Create("passwordResetUrl")) },
            { 
                EmailTemplateType.OrderConfirmation, 
                new TemplateMetadata("OrderConfirmationTemplate", 
                    requiredParameters: ImmutableArray.Create("firstName", 
                        "lastname", 
                        "addressLine1",
                        "addressLine2",
                        "city", 
                        "ZIP", 
                        "email",
                        "state",
                        "country",
                        "phoneNumber", 
                        "orderLines",
                        "totalPrice",
                        "orderDate",
                        "orderId",
                        "paymentMethod")
                )
            },
            {EmailTemplateType.ProductDiscountNotification, 
                new TemplateMetadata("ProductDiscountTemplate", 
                ImmutableArray.Create("ProductPictureUrl", "ProductName","AttributesDescription", "OldPrice", "DiscountedPrice", "ProductUrl")) 
            },
            {
                EmailTemplateType.PromoterInvitation,
                new TemplateMetadata(
                    "PromoterInvitationTemplate",
                    ImmutableArray.Create("callBackUrl")
                )
            },
            {
                EmailTemplateType.InitialOrderFollowUp,
                new TemplateMetadata(
                    "InitialOrderFollowUpTemplate",
                    ["firstName"]
                )
            },
            {
                EmailTemplateType.SecondOrderFollowUp,
                new TemplateMetadata(
                    "SecondOrderFollowUpTemplate",
                    ["firstName", "percentage", "coupon"]
                )
            },
            {
                EmailTemplateType.WelcomeDiscount,
                new TemplateMetadata(
                    "WelcomeDiscountTemplate",
                    ["percentage", "code"]
                )
            }
        };
    }

    public TemplateMetadata GetFileMetadataByTemplateType(EmailTemplateType templateType)
    {
        if(!_templatesMapping.TryGetValue(templateType, out var templateMetadata))        
            throw new ArgumentOutOfRangeException(nameof(templateType), "Unsupported email template type!");

        return templateMetadata;
    }
}
