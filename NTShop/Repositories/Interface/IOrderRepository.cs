using NTShop.Models;
using NTShop.Models.CheckoutModels;

namespace NTShop.Repositories.Interface
{
    public interface IOrderRepository
    {
        public Task<CheckoutResponse> CreatetAsync(OrderModel model, CartModel cart);
        public Task<List<OrderModel>> GetCustomerOrders(string cusomterId);
        public Task<bool> UpdateOrderPaidStatus(string orderId);
    }
}
