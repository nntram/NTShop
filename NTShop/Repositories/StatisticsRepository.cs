using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Data;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.Filters;
using NTShop.Models.StatisticsModels;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly NIENLUANContext _context;

        public StatisticsRepository(IUnitOfWork unitOfWork, IMapper mapper, 
            NIENLUANContext context)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _context = context;
        }

        public List<ProductStatisticsModel> GetBestSellingProduct(DateFilterModel model)
        {
            var data = _context.Set<ProductStatisticsModel>().FromSqlRaw("select top 5 invd.PRODUCTID , PRODUCTNAME, PRODUCTIMAGEURL, count(invd.PRODUCTID) as Quantity " +
                "from INVOICEDETAIL invd join INVOICE inv on invd.INVOICEID = inv.INVOICEID " +
                "join PRODUCT pd on invd.PRODUCTID = pd.PRODUCTID " +
                "join PRODUCTIMAGE pdi on pdi.PRODUCTIMAGEID = (select top 1 pdi.PRODUCTIMAGEID  from PRODUCTIMAGE pdi join PRODUCT pd on pdi.PRODUCTID = invd.PRODUCTID) " +
                "where INVOICECREATEDDATE > " + model.BeginDate + " and INVOICECREATEDDATE < " + model.EndDate + 
                "group by invd.PRODUCTID, PRODUCTNAME, PRODUCTIMAGEURL order by Quantity desc");
            return data.ToList();
        }

        public int GetCustomerCount()
        {
            var data = _unitOfWork.GetRepository<Customer>().Count();
            return data;
        }

        public List<InvoiceStatisticsModel> GetInvoiceStatistics(DateFilterModel model, int type)
        {
            var queryString = "";
            if (type == 0) {
                queryString = "select  COUNT(*) as totalInvoice, sum(invoicetotalamount) as totalAmount, " +
                    "'Tháng ' + convert(varchar, datepart(MM, dateadd(s, convert(bigint, INVOICECREATEDDATE) / 1000, convert(datetime, '1-1-1970 00:00:00')))) as createdDate " +
                    "from invoice " +
                    "where INVOICECREATEDDATE > " + model.BeginDate + " and INVOICECREATEDDATE < " + model.EndDate +
                    "group by convert(varchar, datepart(MM, dateadd(s, convert(bigint, INVOICECREATEDDATE) / 1000, convert(datetime, '1-1-1970 00:00:00'))))";
            }
            else
            {
                queryString = "select  COUNT(*) as totalInvoice, sum(invoicetotalamount) as totalAmount, " +
                    "convert(varchar, (convert(date, dateadd(s, convert(bigint, INVOICECREATEDDATE) / 1000, convert(datetime, '1-1-1970 00:00:00'))))) as createddate " +
                    "from invoice " +
                    "where INVOICECREATEDDATE > " + model.BeginDate + " and INVOICECREATEDDATE < " + model.EndDate +
                    "group by convert(varchar, (convert(date, dateadd(s, convert(bigint, INVOICECREATEDDATE) / 1000, convert(datetime, '1-1-1970 00:00:00')))))";
            }
            var data = _context.Set<InvoiceStatisticsModel>().FromSqlRaw(queryString);
            return data.ToList();
        }

        public int GetOrderCount()
        {
            var data = _unitOfWork.GetRepository<Order>().Count();
            return data;
        }

        public int GetProductCount()
        {
            var data = _unitOfWork.GetRepository<Product>().Count();
            return data;
        }

        public int GetStaffCount()
        {
            var data = _unitOfWork.GetRepository<staff>().Count();
            return data;
        }


    }
}
