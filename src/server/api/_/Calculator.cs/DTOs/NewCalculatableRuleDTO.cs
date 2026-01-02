using Aquadecor.Core.Domain.Entities.Calculator.Rules;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator.DTOs;

public record NewCalculatableRuleDTO(Guid ParameterID, List<RangeRule> RangeRules, bool IsMandatory);
