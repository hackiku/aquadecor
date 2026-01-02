namespace Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies;

public interface ICalculationStrategy
{
    public decimal Calculate(double amount, decimal productPrice, decimal shippingPrice);
}
