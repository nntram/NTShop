using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.CreateModels;
using NTShop.Helpers;
using NTShop.Services.Interfaces;
using NTShop.Services;
using NTShop.Models.UpdateModels;

namespace NTShop.Repositories
{
    public class BrandRepository : IBrandRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerService _fileManagerService;

        public BrandRepository(IUnitOfWork unitOfWork, IMapper mapper,
            IFileManagerService fileManagerService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileManagerService = fileManagerService;
        }

        public async Task<string> Create(BrandCreateModel model)
        {
            if (model.BrandImageFile != null)
            {
                var checkImageFile = FileValid.IsImageValid(model.BrandImageFile);
                if (!checkImageFile)
                {
                    return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";

                }

                if (BrandNameExists(model.Brandname))
                {
                    return "Tên đã tồn tại.";
                }

                var brand = new Brand();
                brand.Brandname = model.Brandname;

                if (model.BrandImageFile?.Length > 0)
                {
                    var upLoadImage = await _fileManagerService.UploadSingleImage(model.BrandImageFile, GetPath.BrandImage);
                    if (upLoadImage.Length > 0)
                    {
                        brand.Brandimage = upLoadImage;
                    }
                    else
                    {
                        return "Đã xảy ra lỗi khi upload ảnh.";
                    }

                    _unitOfWork.GetRepository<Brand>().Insert(brand);
                    await _unitOfWork.SaveChangesAsync();

                    return "success";

                }

            }
            return "Không tìm thấy ảnh.";
        }

        public async Task<string> Delete(string id)
        {

            var brand = await _unitOfWork.GetRepository<Brand>().FindAsync(id);
            if (brand != null)
            {
                var brand_Products = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(predicate: n => n.Brandid == id);
                if (brand_Products != null)
                {
                    return "Không thể xóa do ràng buộc dữ liệu với sản phẩm.";
                }
                _unitOfWork.GetRepository<Brand>().Delete(brand);
                await _unitOfWork.SaveChangesAsync();

                if (brand.Brandimage != null && brand.Brandimage != "")
                {
                    _fileManagerService.DeleteSingleImage(GetPath.BrandImage + brand.Brandimage);
                }
                return "success";
            }
            return "404";
        }

        public async Task<List<BrandModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Brand>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<BrandModel>>(data);
        }

        public async Task<BrandModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Brand>().GetFirstOrDefaultAsync(
                        predicate: x => x.Brandid == id);

            return _mapper.Map<BrandModel>(data);
        }

        public async Task<string> Update(BrandUpdateModel model)
        {
            if (model.BrandImageFile != null)
            {
                var checkImageFile = FileValid.IsImageValid(model.BrandImageFile);
                if (!checkImageFile)
                {
                    return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";

                }
            }

            if (BrandNameExists(model.Brandname, model.Brandid))
            {
                return "Tên đã tồn tại.";
            }

            var brand = await _unitOfWork.GetRepository<Brand>().FindAsync(model.Brandid);

            if (brand == null)
            {
                return "404";
            }

            brand.Brandname = model.Brandname;

            if (model.BrandImageFile != null && model.BrandImageFile?.Length > 0)
            {
                var brandImage = brand.Brandimage;
                var upLoadImage = await _fileManagerService.UploadSingleImage(model.BrandImageFile, GetPath.BrandImage);
                if (upLoadImage.Length > 0)
                {
                    brand.Brandimage = upLoadImage;

                    if (brandImage != null && brandImage != "")
                    {
                        _fileManagerService.DeleteSingleImage(GetPath.BrandImage + brandImage);
                    }
                }
                else
                {
                    return "Đã xảy ra lỗi khi upload ảnh.";
                }
            }

            _unitOfWork.GetRepository<Brand>().Update(brand);
            await _unitOfWork.SaveChangesAsync();

            return "success";
        }

        private bool BrandNameExists(string name)
        {
            var brand = _unitOfWork.GetRepository<Brand>().GetFirstOrDefault(
                               predicate: n => n.Brandname.ToLower() == name.ToLower());
            return brand != null;
        }

        private bool BrandNameExists(string name, string id)
        {
            var brand = _unitOfWork.GetRepository<Brand>().GetFirstOrDefault(
                                predicate: n => (n.Brandname.ToLower() == name.ToLower() && n.Brandid != id));
            return brand != null;
        }
    }
}
