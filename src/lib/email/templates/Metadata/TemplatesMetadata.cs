using System.Collections.Immutable;
using System.Reflection;

namespace Aquadecor.Core.Infrastructure.Email.Common.Templates.Metadata;

public class TemplateMetadata
{

    public string TemplatePath { get; private set; }
    public ImmutableArray<string> RequiredParameters { get; private set; }
    public ImmutableArray<string> ChildrenNodes { get; set; }

    internal TemplateMetadata(string templateName, ImmutableArray<string> requiredParameters)
    {
        TemplatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!,"Templates", $"{templateName}.html");
        RequiredParameters = requiredParameters;
    }
}
