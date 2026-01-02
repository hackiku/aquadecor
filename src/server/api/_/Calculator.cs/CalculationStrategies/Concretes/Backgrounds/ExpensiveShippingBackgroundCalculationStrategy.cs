using Aquadecor.Core.Domain.Use_Cases.Calculator.Helpers;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies.Concretes;

internal class ExpensiveShippingBackgroundCalculationStrategy : ICalculationStrategy
{
    public decimal Calculate(double amount, decimal productPrice, decimal shippingPrice)
    {
        decimal convertedAmount = Convert.ToDecimal(amount);
        decimal totalShipping = ShippingHelpers.CalculateTotalShippingPrice(convertedAmount, shippingPrice);
        return totalShipping + (convertedAmount * productPrice * 1.5M);
    }
}
