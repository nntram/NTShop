using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Helpers;
using NTShop.Models;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Repositories.Interface;

namespace NTShop.Repositories
{
    public class SupplierRepsitory : ISupplierRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SupplierRepsitory(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<string> Create(SupplierCreateModel model)
        {
            var ward = await _unitOfWork.GetRepository<Ward>().FindAsync(model.Wardid);
            if (ward == null)
            {
                return "Mã quận huyện không hợp lệ.";
            }
            var supplier = _mapper.Map<Supplier>(model);
            _unitOfWork.GetRepository<Supplier>().Insert(supplier);
            _unitOfWork.SaveChanges();
            return "success";

        }

        public async Task<string> Delete(string id)
        {
            var supplier = await _unitOfWork.GetRepository<Supplier>().FindAsync(id);
            if (supplier != null)
            {
                var supplier_Receipts = await _unitOfWork.GetRepository<Warehousereceipt>().GetFirstOrDefaultAsync(predicate: n => n.Supplierid == id);
                if (supplier_Receipts != null)
                {
                    return "Không thể xóa do ràng buộc dữ liệu với phiếu nhập.";
                }
                _unitOfWork.GetRepository<Supplier>().Delete(supplier);
                await _unitOfWork.SaveChangesAsync();
             
                return "success";
            }
            return "404";
        }

        public async Task<List<SupplierModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Supplier>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<SupplierModel>>(data);
        }

        public async Task<SupplierModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Supplier>().GetFirstOrDefaultAsync(
                        predicate: x => x.Supplierid == id);

            return _mapper.Map<SupplierModel>(data);
        }

        public async Task<string> Update(SupplierUpdateModel model)
        {
            var supplier = await _unitOfWork.GetRepository<Supplier>().FindAsync(model.Supplierid);
            if (supplier == null)
            {
                return "404";
            }
            var ward = await _unitOfWork.GetRepository<Ward>().FindAsync(model.Wardid);
            if (ward == null)
            {
                return "Mã quận huyện không hợp lệ.";
            }
            _mapper.Map(model, supplier);
            _unitOfWork.GetRepository<Supplier>().Update(supplier);
            _unitOfWork.SaveChanges();
            return "success";
        }
    }
}
