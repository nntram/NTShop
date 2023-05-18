using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Models.CreateModels;
using NTShop.Repositories.Interface;
using Newtonsoft.Json;

namespace NTShop.Repositories
{
    public class WarehouseReceiptRepository : IWarehouseReceiptRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WarehouseReceiptRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<string> Create(WarehouseReceiptCreateModel model)
        {
            if(String.IsNullOrEmpty(model.StrWarehousereceiptdetail))
            {
                return "Yêu cầu không hợp lệ.";
            }

            model.Warehousereceiptdetail = JsonConvert.DeserializeObject<WarehouseReceiptDetailCreateModel[]>(model.StrWarehousereceiptdetail);

            var staff = await _unitOfWork.GetRepository<staff>().FindAsync(model.Staffid);
            if (staff == null)
            {
                return "Mã nhân viên không hợp lệ.";
            }
            var supplier = await _unitOfWork.GetRepository<Supplier>().FindAsync(model.Supplierid);
            if (supplier == null)
            {
                return "Mã nhà cung cấp không hợp lệ.";
            }
            var warehouseReceipt = new Warehousereceipt();
            _mapper.Map(model, warehouseReceipt);
            warehouseReceipt.Warehousereceiptid = Guid.NewGuid().ToString();
            _unitOfWork.GetRepository<Warehousereceipt>().Insert(warehouseReceipt);

            foreach(var item in model.Warehousereceiptdetail)
            {
                var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: p => (p.Productisactive == true && p.Productid == item.Productid));
                if (product == null)
                {
                    return "Không tìm thấy sản phẩm.";
                }//update product quantity
                product.Productquantity += item.Wrdetailquatity;
                product.Productsaleprice = item.Wrdetailsaleprice;
                _unitOfWork.GetRepository<Product>().Update(product);
                var warehouseReceiptDetail = new Warehousereceiptdetail();
                _mapper.Map(item, warehouseReceiptDetail);
                warehouseReceiptDetail.Warehousereceiptid = warehouseReceipt.Warehousereceiptid;
                _unitOfWork.GetRepository<Warehousereceiptdetail>().Insert(warehouseReceiptDetail);
            }

            _unitOfWork.SaveChanges();
            return "success";
        }

        public async Task<List<WarehouseReceiptModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Warehousereceipt>().GetPagedListAsync(
                         pageSize: int.MaxValue,
                         include: p => p.Include(m => m.Staff)
                                      .Include(n => n.Supplier))).Items;

            return _mapper.Map<List<WarehouseReceiptModel>>(data);
        }

        public async Task<WarehouseReceiptModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Warehousereceipt>().GetFirstOrDefaultAsync(
                       predicate: x => x.Warehousereceiptid == id,
                       include: p => p.Include(n => n.Warehousereceiptdetails)
                                      .ThenInclude(o => o.Product).ThenInclude(u => u.Productimages)
                                      .Include(m => m.Staff)
                                      .Include(q => q.Supplier)
                                      );

            return _mapper.Map<WarehouseReceiptModel>(data);
        }
    }
}
