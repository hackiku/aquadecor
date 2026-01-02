using Aquadecor.Core.Domain.Entities.Calculator.Rules;
using System.Collections.Immutable;

namespace Aquadecor.Core.Domain.Entities.Calculator.DTOs;

public record CalculationRuleDTO(string name, ImmutableArray<RangeRule> RangeRules);
