namespace Aquadecor.Application.Migrators.WooCommerceMigrator.Models.ProductVariant;

public class WooCommerceProductVariant
{
    public string Price { get; set; }
    public List<WooCommerceProductAttribute> Attributes { get; set; }

    public Dictionary<string, string> FormatAttributesAsDictionary()
    {
        Dictionary<string, string> attributes = new();
        foreach(var attribute in Attributes)
        {
            attributes.TryAdd(attribute.Name, attribute.Option);
        }
        return attributes;
    }
}
