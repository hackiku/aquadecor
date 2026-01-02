using Aquadecor.Core.Domain.Entities.Catalog.Product;
using System.Collections.Immutable;

namespace Aquadecor.Core.Domain.Entities.Calculator.DTOs;

public record CalculatableCategoryDTO(Guid ID,
    string Name,
    decimal Price,
    Guid? GroupID,
    ImmutableArray<CalculationRuleDTO>? CalculationRules,
    ImmutableArray<CalculatableProductDTO> Products,
    ImmutableArray<CalculatableCategoryType>? CategoryTypes
);


public static class CalculatableCategoryDTOExtensions
{
    public static CalculatableCategoryDTO ToDTO(this CalculatableCategory source, IEnumerable<Product> products)
    {
        ImmutableArray<CalculationRuleDTO>? categoryCalculationRules = source.CalculationRules?
            .Select(
                rule => new CalculationRuleDTO(rule.Parameter.Name, rule.Rules.ToImmutableArray())
            )
            .ToImmutableArray();

        ImmutableArray<CalculatableProductDTO> calculatableCategoryProducts = products
            .Select(product => new CalculatableProductDTO(product.Name, product.Price, product.PictureUrl))
            .ToImmutableArray();

        ImmutableArray<CalculatableCategoryType> categoryTypes = source
            .CategoryTypes
            .OrderBy(ct => ct.Name)
            .ToImmutableArray();

        CalculatableCategoryDTO calculatableCategoryResult = new(source.ID, 
            source.Name, 
            source.Price,
            source.CalculatableGroup?.ID, 
            categoryCalculationRules, 
            calculatableCategoryProducts,
            categoryTypes
        );

        return calculatableCategoryResult;
    }
}
