using Aquadecor.Core.Domain.Entities.Calculator;
using Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies.Concretes;
using Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies.Concretes.Backgrounds;
using Microsoft.Extensions.DependencyInjection;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies;

public class CalculationStrategyResolver
{
    private readonly IServiceProvider _serviceProvider;
    private Dictionary<CalculationStrategy, Type> _calculationStrategies = new() {
        {CalculationStrategy.Default, typeof(BasicCalculationStrategy)},
        {CalculationStrategy.Expensive_SquareMeter_Price, typeof(ExpensiveSquareMeterBackgroundCalculationStrategy)},
        {CalculationStrategy.Expensive_Shipping_Price, typeof(ExpensiveShippingBackgroundCalculationStrategy)},
        {CalculationStrategy.Regular_Background, typeof(RegularBackgroundCalculationStrategy) }
    };
    public CalculationStrategyResolver(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public ICalculationStrategy GetCalculationStrategy(CalculationStrategy calculationStrategy) =>
        (ICalculationStrategy)_serviceProvider.GetRequiredService(_calculationStrategies[calculationStrategy]);
}
