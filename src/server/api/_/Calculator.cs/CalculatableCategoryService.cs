using Aquadecor.Core.Domain.Entities.Calculator.DTOs;
using Aquadecor.Core.Domain.Entities.Calculator;
using System.Collections.Immutable;
using Aquadecor.Core.Domain.Contracts.Repositories;
using CatalogNamespace = Aquadecor.Core.Domain.Entities.Catalog;
using Aquadecor.Core.Domain.Entities.Calculator.Rules;
using Aquadecor.Core.Domain.Use_Cases.Calculator.DTOs;
using Aquadecor.Core.Domain.ValueObjects;
using Aquadecor.Common.Constants;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator;

public class CalculatableCategoryService
{
    private readonly ICalculatableCategoryRepository _calculatableCategoryRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICalculationParameterRepository _calculationParameterRepository;
    private readonly ICalculationAmountFormulaRepository _calculationAmountFormulaRepository;
    private readonly ICalculatableGroupRepository _calculatableGroupRepository;

    public CalculatableCategoryService(ICalculatableCategoryRepository calculatableCategoryRepository, 
        ICategoryRepository categoryRepository, 
        IProductRepository productRepository,
        ICalculationParameterRepository calculationParameterRepository,
        ICalculationAmountFormulaRepository calculationAmountFormulaRepository,
        ICalculatableGroupRepository calculatableGroupRepository)
    {
        _calculatableCategoryRepository = calculatableCategoryRepository;
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
        _calculationParameterRepository = calculationParameterRepository;
        _calculationAmountFormulaRepository = calculationAmountFormulaRepository;
        _calculatableGroupRepository = calculatableGroupRepository;
    }

    public async Task<IReadOnlyCollection<CalculatableCategoryDTO>> GetAll()
    {
        var categories = await _calculatableCategoryRepository.GetAll();

        List<CalculatableCategoryDTO> categoriesDto = categories
            .Select(category => category.ToDTO([]))
            .ToList();

        return categoriesDto.AsReadOnly();
    }

    public async Task<CalculatableCategoryDTO> GetCalculatableCategoryByInventoryId(Guid inventoryCategoryId)
    {
        CalculatableCategory? calculatableCategory = await _calculatableCategoryRepository.GetByCatalogCategoryIdAsync(inventoryCategoryId)
            ?? throw new KeyNotFoundException("Given category is not calculatable.");

        IReadOnlyCollection<CatalogNamespace.Product.Product> availableProductsToCalculate =
            await _productRepository.GetProductsByCategoryIdAsync(inventoryCategoryId);

        ImmutableArray<CalculatableProductDTO> calculatableCategoryProducts = availableProductsToCalculate
            .Select(product => new CalculatableProductDTO(product.Name, product.Price, product.PictureUrl)).ToImmutableArray();


        CalculatableCategoryDTO calculatableCategoryResult = calculatableCategory.ToDTO(availableProductsToCalculate);
        return calculatableCategoryResult;
    }

    public async Task<CalculatableCategoryDTO> GetCalculatableCategoryByIdAsync(Guid id)
    {
        CalculatableCategory? calculatableCategory = await _calculatableCategoryRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Given category is not calculatable.");

        IReadOnlyCollection<CatalogNamespace.Product.Product> availableProductsToCalculate =
            await _productRepository.GetProductsByCategoryIdAsync(calculatableCategory.CatalogCategoryID);


        CalculatableCategoryDTO calculatableCategoryResult = calculatableCategory.ToDTO(availableProductsToCalculate);
        return calculatableCategoryResult;
    }

    public async Task AddCalculatableCategoryAsync(Guid inventoryCategoryId,
        CalculationStrategy calculationStrategy,
        Guid amountFormulaId,
        decimal price,
        IList<NewCalculatableRuleDTO> calculationRules,
        IEnumerable<NewCalculatableCategoryTypeDTO> calculatableCategoryTypes,
        Guid? calculatableGroupId)
    {
        CatalogNamespace.Category inventoryCategory = await _categoryRepository.GetByIdAsync(inventoryCategoryId) ??
            throw new KeyNotFoundException("Category does not exist.");

        //[TO-DO]: Return dictionary and access by key instead of iterating through collection
        IReadOnlyCollection<CalculationParameter> calculationParameters = await _calculationParameterRepository.GetByIdRange(
            calculationRules.Select(x => x.ParameterID.ToString())
            .ToArray());

        if (calculationParameters.Count != calculationRules.Count)
            throw new ArgumentException("Some of parameters does not exist.");

        List<CalculationRule> calculationRulesToAdd = calculationRules.Select(rule => 
            new CalculationRule(
                Guid.NewGuid(),
                calculationParameters.First(param=>param.ID == rule.ParameterID), 
                rule.RangeRules,
                rule.IsMandatory))
            .ToList();

        List<CalculatableCategoryType> calcutableCategoryTypesConverted = calculatableCategoryTypes.Select(categoryType =>
            new CalculatableCategoryType(
                categoryType.Name, 
                new Money(Currency.DOLLAR, 
                categoryType.PriceOverride))
            )
            .ToList();
        
        AmountFormula amountCalculationFormula = await _calculationAmountFormulaRepository.GetByIdAsync(amountFormulaId) ??
            throw new KeyNotFoundException("Amount formula does not exist.");

        CalculatableGroup? categoryCalculatableGroup = null;
        if (calculatableGroupId.HasValue)
            categoryCalculatableGroup = await _calculatableGroupRepository.GetByIdAsync(calculatableGroupId.Value)
                ?? throw new KeyNotFoundException("Calculatable group does not exist.");


        CalculatableCategory calculatableCategory = new(Guid.NewGuid(),
            inventoryCategoryId,
            inventoryCategory.Name,
            price,
            calculationStrategy,
            calculationRulesToAdd,
            calcutableCategoryTypesConverted,
            amountCalculationFormula,
            categoryCalculatableGroup);

        await _calculatableCategoryRepository.AddAsync(calculatableCategory);
        await _calculatableCategoryRepository.SaveAsync();
    }

    public async Task RemoveAsync(Guid ID)
    {
        CalculatableCategory categoryToRemove = await _calculatableCategoryRepository.GetByIdAsync(ID)
            ?? throw new KeyNotFoundException("Calculatable category does not exist.");

        _calculatableCategoryRepository.Remove(categoryToRemove);

        await _calculatableCategoryRepository.SaveAsync();
    }

    public async Task UpdateAsync(
        Guid ID,
        decimal editedPrice,
        string editedName,
        List<NewCalculatableCategoryTypeDTO> editedCategoryTypes
    )
    {
        CalculatableCategory existingCalculatableCategory = await _calculatableCategoryRepository.GetByIdAsync(ID)
            ?? throw new KeyNotFoundException("Calculatable category does not exist.");

        existingCalculatableCategory.Update(
            editedName,
            editedPrice,
            editedCategoryTypes.Select(categoryType => new CalculatableCategoryType(
                categoryType.Name,
                new(categoryType.PriceOverride))
            )
        );

        await _calculatableCategoryRepository.SaveAsync();
    }
}
