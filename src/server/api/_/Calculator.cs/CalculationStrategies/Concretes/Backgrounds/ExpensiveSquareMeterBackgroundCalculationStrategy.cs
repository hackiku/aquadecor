using Aquadecor.Core.Domain.Use_Cases.Calculator.Helpers;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies.Concretes;

internal class ExpensiveSquareMeterBackgroundCalculationStrategy : ICalculationStrategy
{
    public decimal Calculate(double amount, decimal productPrice, decimal shippingPrice)
    {
        decimal convertedAmount = Convert.ToDecimal(amount);
        productPrice = amount >=2 ? 
            productPrice*1.5M : 
            productPrice;

        decimal totalShipping = ShippingHelpers.CalculateTotalShippingPrice(convertedAmount, shippingPrice);
        return totalShipping + (convertedAmount*productPrice);
    }
}
