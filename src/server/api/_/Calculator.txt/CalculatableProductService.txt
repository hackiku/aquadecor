using Aquadecor.Core.Domain.Contracts.Repositories;
using Aquadecor.Core.Domain.Entities.Calculator;
using Aquadecor.Core.Domain.Entities.Calculator.DTOs;
using Aquadecor.Core.Domain.Entities.Calculator.Rules;
using Aquadecor.Core.Domain.Helpers;
using Aquadecor.Core.Domain.Use_Cases.Calculator.DTOs;
using CatalogNamespace = Aquadecor.Core.Domain.Entities.Catalog.Product;

namespace Aquadecor.Core.Domain.Use_Cases;

public class CalculatableProductService
{
    private readonly ICalculatableGroupRepository _calculatableGroupRepository;
    private readonly ICalculatableProductRepository _calculatableProductRepository;
    private readonly ICalculationAmountFormulaRepository _calculatableAmountFormulaRepository;
    private readonly ICalculationParameterRepository _calculationParameterRepository;
    private readonly IProductRepository _productRepository;

    public CalculatableProductService(ICalculatableGroupRepository calculatableGroupRepository, 
        ICalculatableProductRepository calculatableProductRepository, 
        ICalculationAmountFormulaRepository calculatableAmountFormulaRepository, 
        ICalculationParameterRepository calculationParameterRepository,
        IProductRepository productRepository)
    {
        _calculatableGroupRepository = calculatableGroupRepository;
        _calculatableProductRepository = calculatableProductRepository;
        _calculatableAmountFormulaRepository = calculatableAmountFormulaRepository;
        _calculationParameterRepository = calculationParameterRepository;
        _productRepository = productRepository;
    }

    public async Task AddAsync(Guid calculatableGroupId,
        Guid productInventoryId,
        CalculationStrategy calculationStrategy,
        Guid amountFormulaId,
        IList<NewCalculatableRuleDTO> calculationRules)
    {
        CalculatableGroup calculatableGroup = await _calculatableGroupRepository.GetByIdAsync(calculatableGroupId) ??
            throw new KeyNotFoundException("Calculatable group does not exist.");

        CatalogNamespace.Product foundProduct = await _productRepository.GetByIdAsync(productInventoryId) ??
            throw new KeyNotFoundException("Product does not exist.");

        IReadOnlyCollection<CalculationParameter> calculationParameters = await _calculationParameterRepository.GetByIdRange(
            calculationRules.Select(x => x.ParameterID.ToString())
            .ToArray());

        //[TODO] - Improve this check, because it's possible to 3 same objects in request 
        if (calculationParameters.Count != calculationRules.Count)
            throw new ArgumentException("Some of parameters does not exist.");

        List<CalculationRule> calculationRulesToAdd = calculationRules.Select(rule =>
            new CalculationRule(
                calculationParameters.First(param => param.ID == rule.ParameterID),
                rule.RangeRules,
                rule.IsMandatory))
            .ToList();

        AmountFormula amountFormula = await _calculatableAmountFormulaRepository.GetByIdAsync(amountFormulaId) ??
            throw new KeyNotFoundException("Amount formula does not exist");

        CalculatableProduct calculatableProductToAdd = new(foundProduct.Name,
            calculationStrategy,
            productInventoryId,
            calculationRulesToAdd, 
            amountFormula,
            foundProduct.PictureUrl,
            foundProduct.Price
        );

        calculatableGroup.AddProduct(calculatableProductToAdd);
        await _calculatableGroupRepository.SaveAsync();
    }

    public async Task RemoveAsync(Guid calculatableProductId)
    {
        CalculatableProduct productToRemove = await GetEntityOrThrow(calculatableProductId);

        _calculatableProductRepository.Remove(productToRemove);

        await _calculatableProductRepository.SaveAsync();
    }

    public async Task UpdateAsync(
        Guid ID, 
        CalculatableProductDTO editedCalculatableProduct
    )
    {
        CalculatableProduct existingCalculatableProduct = await GetEntityOrThrow(ID);

        existingCalculatableProduct.Update(
            editedCalculatableProduct.Name,
            editedCalculatableProduct.PictureUrl,
            editedCalculatableProduct.Price,
            existingCalculatableProduct.CalculationRules
        );

        await _calculatableProductRepository.SaveAsync();
    }

    public async Task<CalculatableProductDTO> GetByIdAsync(Guid ID)
    {
        CalculatableProduct existingCalculatableProduct = await GetEntityOrThrow(ID);

        return new CalculatableProductDTO(existingCalculatableProduct.Name, existingCalculatableProduct.Price, existingCalculatableProduct.PictureUrl);
    }

    private async Task<CalculatableProduct> GetEntityOrThrow(Guid ID)
    {
        return await _calculatableProductRepository.GetByIdAsync(ID)
            ?? throw new KeyNotFoundException("Calculatable product does not exist.");
    }
}
