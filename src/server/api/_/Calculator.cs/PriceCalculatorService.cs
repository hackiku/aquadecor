using AngouriMath;
using Aquadecor.Common.Constants;
using Aquadecor.Common.Extensions;
using Aquadecor.Core.Domain.Common.Constants;
using Aquadecor.Core.Domain.Contracts;
using Aquadecor.Core.Domain.Contracts.Repositories;
using Aquadecor.Core.Domain.Entities.Calculator;
using Aquadecor.Core.Domain.Entities.Calculator.Rules;
using Aquadecor.Core.Domain.Entities.SupportedCountry;
using Aquadecor.Core.Domain.Use_Cases.Calculator.CalculationStrategies;
using Aquadecor.Core.Domain.ValueObjects;
using System.Collections.Immutable;
using System.Threading.Tasks;
using SupportedCountry = Aquadecor.Core.Domain.Entities.SupportedCountry;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator;

public class PriceCalculatorService
{
    private readonly IExchangeService _exchangeService;
    private readonly ICountryRepository _countryRepository;
    private readonly ICalculatableCategoryRepository _calculatableCategoryRepository;
    private readonly ICalculatableGroupRepository _calculatableGroupRepository;
    private readonly ICalculationParameterRepository _calculationParameterRepository;
    private readonly ICalculationAmountFormulaRepository _calculationAmountFormulaRepository;
    private readonly ICalculatableProductRepository _calculatableProductRepository;
    private readonly CalculationStrategyResolver _calculationStrategyResolver;

    public PriceCalculatorService(
        IExchangeService exchangeService,
        CalculationStrategyResolver calculationStrategyResolver,
        ICountryRepository countryRepository,
        ICalculatableCategoryRepository calculatableCategoryRepository,
        ICalculatableGroupRepository calculatableGroupRepository,
        ICalculationParameterRepository calculationParameterRepository,
        ICalculationAmountFormulaRepository calculationAmountFormulaRepository,
        ICalculatableProductRepository calculatableProductRepository)
    {
        _exchangeService = exchangeService;
        _calculationStrategyResolver = calculationStrategyResolver;
        _countryRepository = countryRepository;
        _calculatableCategoryRepository = calculatableCategoryRepository;
        _calculatableGroupRepository = calculatableGroupRepository;
        _calculationParameterRepository = calculationParameterRepository;
        _calculationAmountFormulaRepository = calculationAmountFormulaRepository;
        _calculatableProductRepository = calculatableProductRepository;
    }

    public async Task<IReadOnlyCollection<CalculationParameter>> GetCalculationParameters() =>
        (await _calculationParameterRepository.GetAll()).ToList().AsReadOnly();

    public async Task AddCalculationParameter(string parameterName)
    {
        CalculationParameter calculationParameter = new(Guid.NewGuid(),parameterName);
        await _calculationParameterRepository.AddAsync(calculationParameter);
        await _calculationParameterRepository.SaveAsync();
    }

    public async Task<IReadOnlyCollection<CalculatableGroup>> GetCalculatableGroupsAsync() =>
        await _calculatableGroupRepository.GetAllWithProductsAndCategories();

    public async Task<string> AddAmountFormulaAsync(string name, string amountFormula)
    {
        string[] parameters = RegexPatterns.INSIDE_OF_CURLY_BRACES.Matches(amountFormula)
            .Select(match => match.Value)
            .Distinct()
            .ToArray();

        Dictionary<string, string> parametersWithoutCurlyBraces = new(parameters.Length);

        foreach(string parameter in parameters)
            parametersWithoutCurlyBraces.TryAdd(parameter, parameter[1..^1]);

        IReadOnlyCollection<CalculationParameter> foundParameters = await _calculationParameterRepository.GetByIdRange(
            parametersWithoutCurlyBraces.Values.ToArray());

        if (foundParameters.Count != parameters.Length)
            throw new ArgumentException("Some of parameters does not exist!");

        string amountFormulaWithReplacedParameters = ReplaceParametersInAmountFormula(amountFormula, parameters);

        _ = MathS.Parse(amountFormulaWithReplacedParameters).Switch(
                res => res,
                failure => failure.Reason.Switch<Entity>(
                    (unknown) => throw new ArgumentException("You entered invalid amount formula. Reason: Unknown"),
                    (missingOp) => throw new ArgumentException("You entered invalid amount formula. Reason: Missing operator"),
                    (internalError) => throw new ArgumentException("You entered invalid amount formula. Reason: Internal Error")
                )
            );

        string realAmountFormula = amountFormula.Replace(parametersWithoutCurlyBraces);

        AmountFormula amountFormulaToAdd = new(realAmountFormula,name);
        await _calculationAmountFormulaRepository.AddAsync(amountFormulaToAdd);
        await _calculationAmountFormulaRepository.SaveAsync();

        return amountFormulaWithReplacedParameters;
    }

    public async Task<IReadOnlyCollection<AmountFormula>> GetAmountFormulasAsync() =>
        (await _calculationAmountFormulaRepository.GetAll()).ToList().AsReadOnly();

    public async Task<decimal> CalculatePriceByCategoryIdAsync(Guid calculatableCategoryId, 
        Guid shippingCountryId,
        Guid? calculatableCategoryTypeId,
        Currency currencyToDisplay,
        Dictionary<string,ParameterValue> parameterValues)
    {
        CalculatableCategory? categoryToCalculate = await _calculatableCategoryRepository.GetByIdAsync(calculatableCategoryId) ??
            throw new KeyNotFoundException("Category which you have specified is not calculatable.");

        Dictionary<string, ParameterValue> parameterValuesConverted = parameterValues
            .Select(parameterValue => new KeyValuePair<string, ParameterValue>(
                parameterValue.Key,
                new ParameterValue(
                    parameterValue.Value.Unit == Unit.Inch ? parameterValue.Value.Value * 2.54 : parameterValue.Value.Value,
                    parameterValue.Value.Unit == Unit.Inch ? Unit.Centimeter : parameterValue.Value.Unit
                )
            ))
            .ToDictionary(x => x.Key, x => x.Value);


        if (!categoryToCalculate.AreRuleValuesValid(parameterValues))
            throw new ArgumentOutOfRangeException(nameof(parameterValues), "You entered invalid parameter values");

        bool categoryHasTypes = categoryToCalculate.CategoryTypes.Any();

        if (categoryHasTypes && calculatableCategoryTypeId is null)
            throw new ArgumentException("Please specify category type.");

        SupportedCountry.Country selectedShippingCountry = await _countryRepository.GetByIdAsync(shippingCountryId) ??
            throw new KeyNotFoundException("Selected country does not exist!");

        Money shippingPrice = await GetShippingPriceByCountry(selectedShippingCountry, currencyToDisplay);

        foreach(var optionalRule in categoryToCalculate.OptionalCalculationRules)
        {
            parameterValuesConverted.TryAdd(optionalRule.Parameter.ID.ToString(),null);
        }
        double calculatedAmount = categoryToCalculate.AmountFormula.Evaluate(parameterValuesConverted);

        decimal categoryPrice = categoryHasTypes ?
            categoryToCalculate.CategoryTypes.First(param => param.ID == calculatableCategoryTypeId).PriceOverride.Amount :
            categoryToCalculate.Price;

        decimal exchangeRate = await _exchangeService.GetExchangeRateAsync(Currency.EURO, to: currencyToDisplay);

        Money convertedCategoryPrice = new(currencyToDisplay, categoryPrice * exchangeRate);

        ICalculationStrategy calculationStrategy = _calculationStrategyResolver.GetCalculationStrategy(categoryToCalculate.ProductCalculationStrategy);

        decimal totalPrice = calculationStrategy.Calculate(
            calculatedAmount, 
            convertedCategoryPrice.Amount, 
            shippingPrice.Amount
        );

        return Math.Round(totalPrice, 2);
    }

    public async Task<decimal> CalculatePriceByProductIdAsync(Guid calculatableProductId,
        Guid shippingCountryId,
        Currency currencyToDisplay,
        Dictionary<string, ParameterValue> parameterValues)
    {
        CalculatableProduct? productToCalculate = await _calculatableProductRepository.GetByIdAsync(calculatableProductId) ??
            throw new KeyNotFoundException("Product which you have specified is not calculatable.");

        SupportedCountry.Country selectedShippingCountry = await _countryRepository.GetByIdAsync(shippingCountryId) ??
            throw new KeyNotFoundException("Selected country does not exist!");

        Money shippingPrice = await GetShippingPriceByCountry(selectedShippingCountry, currencyToDisplay);

        double calculatedAmount = productToCalculate.AmountFormula.Evaluate(parameterValues);

        ICalculationStrategy calculationStrategy = _calculationStrategyResolver.GetCalculationStrategy(productToCalculate.ProductCalculationStrategy);

        decimal exchangeRate = await _exchangeService.GetExchangeRateAsync(
            productToCalculate.Price.Currency, 
            to: currencyToDisplay
        );

        decimal productPrice = productToCalculate.Price.Amount * exchangeRate;

        decimal totalPrice = calculationStrategy.Calculate(calculatedAmount, productPrice, shippingPrice.Amount);

        return totalPrice;
    }

    private static string ReplaceParametersInAmountFormula(string amountFormula, string[] replacementParameters)
    {
        Dictionary<string, char> mappedParametersForFormula = new();
        char formulaParameter = 'a';
        for (int i = 0; i < replacementParameters.Length; i++)
        {
            if (formulaParameter > 'z')
                throw new ArgumentException("You have reached maximum number of parameters (30).");

            if (mappedParametersForFormula.TryAdd(replacementParameters[i], formulaParameter))
                formulaParameter++;
        }

        string amountFormulaWithReplacedParameters = amountFormula.Replace(mappedParametersForFormula);
        return amountFormulaWithReplacedParameters;
    }

    private async Task<Money> GetShippingPriceByCountry(SupportedCountry.Country selectedCountry, Currency currency)
    {
        decimal shippingPrice = selectedCountry.ShippingRegion switch
        {
            ShippingRegion.Africa => 160,
            ShippingRegion.Asia => 160,
            ShippingRegion.Australia => 160,
            ShippingRegion.Europe => 110,
            ShippingRegion.America => 130,
            ShippingRegion.Serbia => 45,
            _ => 130
        };

        if(currency == Currency.EURO)
        {
            return new Money(shippingPrice);
        }
        
        decimal exchangeRate = await _exchangeService.GetExchangeRateAsync(Currency.EURO, currency);

        return new(currency, exchangeRate*shippingPrice);
    }
}
