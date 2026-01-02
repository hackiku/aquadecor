namespace Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies.Concretes;

public class BasicCalculationStrategy : ICalculationStrategy
{
    public decimal Calculate(double amount, decimal productPrice, decimal shippingPrice)
    {
        decimal calculatedPriceResult = Math.Round(Convert.ToInt32(amount) * productPrice,2);
        return calculatedPriceResult;
    }
}
