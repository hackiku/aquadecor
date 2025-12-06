using Aquadecor.Application.Migrators.WooCommerceMigrator.Models.Csv;
using CsvHelper.Configuration;

namespace Aquadecor.Application.Migrators.WooCommerceMigrator.Mappings;

public class WooCommerceCsvRowMapping : ClassMap<WooCommerceCsvRow>
{
    public WooCommerceCsvRowMapping()
    {
        Map(x => x.Attribute1_Name).Name("Attribute 1 name");
        Map(x => x.Attribute1_Values).Name("Attribute 1 value(s)");
        Map(x => x.Attribute2_Name).Name("Attribute 2 name");
        Map(x => x.Attribute2_Values).Name("Attribute 2 value(s)");
        Map(x => x.ImageUrls).Name("Images");
        Map(x => x.Categories).Name("Categories");
        Map(x => x.ID).Name("ID");
        Map(x => x.Name).Name("Name");
        Map(x => x.Type).Name("Type");
        Map(x => x.Price).Name("Regular price");
    }
}
