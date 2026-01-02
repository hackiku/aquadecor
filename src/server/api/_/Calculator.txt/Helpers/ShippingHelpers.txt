namespace Aquadecor.Core.Domain.Use_Cases.Calculator.Helpers;

public static class ShippingHelpers
{
    public static decimal CalculateTotalShippingPrice(decimal amount, decimal shippingPrice)
    {
        if (amount <= 1)
            return shippingPrice;
        if (amount <= 10)
        {
            int areaGroup = (int)Math.Ceiling(amount * 2); 
            shippingPrice += (areaGroup - 2) * (shippingPrice / 2);
            return shippingPrice;
        }
        shippingPrice = amount / 0.5M * (shippingPrice/2);
        return shippingPrice;
    }
}
