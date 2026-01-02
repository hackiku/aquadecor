using Aquadecor.Core.Domain.Contracts.Repositories;
using Aquadecor.Core.Domain.Entities.Calculator;
using Aquadecor.Core.Domain.Entities.Calculator.DTOs;
using Aquadecor.Core.Domain.Use_Cases.Calculator.DTOs;
using System.Collections.Immutable;
using CatalogAggregate = Aquadecor.Core.Domain.Entities.Catalog;

namespace Aquadecor.Core.Domain.Use_Cases.Calculator;

public class CalculatableGroupService
{
    private readonly ICalculatableGroupRepository _calculatableGroupRepository;
    public CalculatableGroupService(ICalculatableGroupRepository calculatableGroupRepository)
    {
        _calculatableGroupRepository = calculatableGroupRepository;
    }

    public async Task<IReadOnlyCollection<CalculatableGroupDTO>> GetAllWithProductsAndCategories()
    {
        IReadOnlyCollection<CalculatableGroup> calculatableGroups = await _calculatableGroupRepository.GetAllWithProductsAndCategories();
        IReadOnlyCollection<CalculatableGroupDTO> calculatableGroupsResponse = 
            calculatableGroups.Select(group => 
                new CalculatableGroupDTO(group.ID,
                    group.Name,
                    group.IsMandatory,
                    group.ReleatedCategories.Select(category=>category.ToDTO(Enumerable.Empty<CatalogAggregate.Product.Product>())).ToImmutableArray(), 
                    group.ReleatedProducts.ToImmutableArray())).ToList().AsReadOnly();

        return calculatableGroupsResponse;
    }

    public async Task AddAsync(string name, bool isMandatory)
    {
        CalculatableGroup calculatableGroupToAdd = new(name, isMandatory);
        await _calculatableGroupRepository.AddAsync(calculatableGroupToAdd);
        await _calculatableGroupRepository.SaveAsync();
    }

    public async Task RemoveAsync(Guid id)
    {
        CalculatableGroup calculatableGroup = await _calculatableGroupRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException();

        _calculatableGroupRepository.Remove(calculatableGroup);
        await _calculatableGroupRepository.SaveAsync();
    }
}
