using Aquadecor.Core.Domain.Entities.Calculator;
using Aquadecor.Core.Domain.Entities.Calculator.DTOs;
using System.Collections.Immutable;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator.DTOs;

public record CalculatableGroupDTO(Guid ID, string Name, bool IsMandatory,ImmutableArray<CalculatableCategoryDTO> Categories, ImmutableArray<CalculatableProduct> Products);
