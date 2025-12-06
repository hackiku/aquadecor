namespace Aquadecor.Application.Migrators.WooCommerceMigrator.Models.Csv;

public class WooCommerceCsvRow
{
    public string ID { get; set; }
    public string Categories { get; set; }
    public string Type { get; set; }
    public string Name { get; set; }
    public string Published { get; set; }
    public string Attribute1_Name { get; set; }
    public string Attribute1_Values { get; set; }
    public string Attribute2_Name { get; set;}
    public string Attribute2_Values { get; set; }
    public string ImageUrls { get; set; }
    public string Price { get; set; }

    public string[] FirstAttributeValues =>
        Attribute1_Values.Split(',');

    public string[] SecondAttributeValues=>
        Attribute2_Values.Split(',');
}
