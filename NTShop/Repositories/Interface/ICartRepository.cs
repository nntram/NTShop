using NTShop.Models;
using NTShop.Models.CreateModels;

namespace NTShop.Repositories.Interface
{
    public interface ICartRepository
    {
        public Task<CartModel> GetCustomerCart(string cusomterId);
        public Task<string> AddToCart(string cartId, AddToCartModel model);
        public Task<string> IncreaseOne(string cartDetailtId);
        public Task<string> DecreaseOne(string cartDetailtId);
        public Task<string> Remove(string cartDetailtId);
    }
}
