using Aquadecor.Core.Domain.ValueObjects;

namespace Aquadecor.Core.Domain.Entities.Calculator.DTOs;

public record CalculatableProductDTO(string Name, Money Price, string? PictureUrl);
