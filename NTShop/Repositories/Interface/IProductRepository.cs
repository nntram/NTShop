using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.CreateModels;
using NTShop.Models.Filters;
using NTShop.Models.UpdateModels;

namespace NTShop.Repositories.Interface
{
    public interface IProductRepository
    {
        public Task<List<ProductModel>> GetAllAsync();
        public Task<ProductModel> GetByIdAsync(string id);
        public Task<PagedList<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter);
        public Task<string> Create(ProductCreateModel model);
        public Task<string> Update(ProductUpdateModel model);
        public Task<string> Delete(string id);
    }
}
