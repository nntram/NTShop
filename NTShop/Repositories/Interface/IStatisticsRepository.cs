using NTShop.Models;
using NTShop.Models.Filters;
using NTShop.Models.StatisticsModels;
using System.Security;

namespace NTShop.Repositories.Interface
{
    public interface IStatisticsRepository 
    {
        public int GetProductCount();
        public int GetCustomerCount();
        public int GetStaffCount();
        public int GetOrderCount();
        public List<ProductStatisticsModel> GetBestSellingProduct(DateFilterModel model);
        public List<InvoiceStatisticsModel> GetInvoiceStatistics(DateFilterModel model, int type);

    }
}
