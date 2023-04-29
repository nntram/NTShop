using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using NTShop.Models;
using NTShop.Models.CheckoutModels;
using NTShop.Models.Filters;

namespace NTShop.Repositories.Interface
{
    public interface IOrderRepository
    {
        public Task<CheckoutResponse> CreatetAsync(OrderModel model, CartModel cart);
        public Task<List<OrderModel>> GetCustomerOrders(string cusomterId);
        public Task<bool> UpdateOrderPaidStatus(string orderId);
        public Task<bool> UpdateOrderStatus(OrderStatusUpdateModel model);
        public Task<List<OrderStatusModel>> GetOrderStatus();
        public Task<OrderModel> GetByIdAsync(string id);
        public Task<PagedList<OrderModel>> GetPagedOrders(OrderGetpagedModel filter);
    }
}
