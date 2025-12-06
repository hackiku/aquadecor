namespace Aquadecor.Application.Migrators.WooCommerceMigrator.Models;

public class VariableProduct
{
    public string Name { get; set; }
    public List<Variant> Variants { get; set; }
}

public class Variant
{
    public Variant(Dictionary<string, string> attributes, string pictureUrl)
    {
        Attributes = attributes;
        PictureUrl = pictureUrl.Replace("https://aquadecorbackgrounds.com/wp-content", "D:");
        PictureUrl = PictureUrl.Replace('/','\\');
    }
    public Dictionary<string, string> Attributes = new();
    public string PictureUrl { get; set; }
}
