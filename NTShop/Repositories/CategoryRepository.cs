using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Helpers;
using NTShop.Services.Interfaces;

namespace NTShop.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerService _fileManagerService;

        public CategoryRepository(IUnitOfWork unitOfWork, 
            IMapper mapper, 
            IFileManagerService fileManagerService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileManagerService = fileManagerService;
        }

        public async Task<string> Create(CategoryCreateModel model)
        {
            if (model.CategoryImageFile != null)
            {
                var checkImageFile = FileValid.IsImageValid(model.CategoryImageFile);
                if (!checkImageFile)
                {
                    return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";

                }

                if (CategoryNameExists(model.Categoryname))
                {
                    return "Tên đã tồn tại.";
                }

                var category = new Category();
                category.Categoryname = model.Categoryname;

                if (model.CategoryImageFile?.Length > 0)
                {
                    var upLoadImage = await _fileManagerService.UploadSingleImage(model.CategoryImageFile, GetPath.CategoryImage);
                    if (upLoadImage.Length > 0)
                    {
                        category.Categoryimage = upLoadImage;
                    }
                    else
                    {
                        return "Đã xảy ra lỗi khi upload ảnh.";
                    }

                    _unitOfWork.GetRepository<Category>().Insert(category);
                    await _unitOfWork.SaveChangesAsync();

                    return "success";

                }

            }
            return "Không tìm thấy ảnh.";
        }

        public async Task<string> Delete(string id)
        {

            var category = await _unitOfWork.GetRepository<Category>().FindAsync(id);
            if (category != null)
            {
                var category_Products = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(predicate: n => n.Categoryid == id);
                if (category_Products != null)
                {
                    return "Không thể xóa do ràng buộc dữ liệu với sản phẩm.";
                }
                _unitOfWork.GetRepository<Category>().Delete(category);
                await _unitOfWork.SaveChangesAsync();

                if (category.Categoryimage != null && category.Categoryimage != "")
                {
                    _fileManagerService.DeleteSingleImage(GetPath.CategoryImage + category.Categoryimage);
                }
                return "success";
            }
            return "404";
        }

        public async Task<List<CategoryModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Category>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<CategoryModel>>(data);
        }
      
        public async Task<CategoryModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Category>().GetFirstOrDefaultAsync(
                        predicate: x => x.Categoryid == id);

            return _mapper.Map<CategoryModel>(data);
        }

        public async Task<string> Update(CategoryUpdateModel model)
        {
            if (model.CategoryImageFile != null)
            {
                var checkImageFile = FileValid.IsImageValid(model.CategoryImageFile);
                if (!checkImageFile)
                {
                    return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";

                }
            }

            if (CategoryNameExists(model.Categoryname, model.Categoryid))
            {
                return "Tên đã tồn tại.";
            }

            var category = await _unitOfWork.GetRepository<Category>().FindAsync(model.Categoryid);

            if (category == null)
            {
                return "404";
            }

            category.Categoryname = model.Categoryname;

            if (model.CategoryImageFile != null && model.CategoryImageFile?.Length > 0)
            {
                var categoryImage = category.Categoryimage;
                var upLoadImage = await _fileManagerService.UploadSingleImage(model.CategoryImageFile, GetPath.CategoryImage);
                if (upLoadImage.Length > 0)
                {
                    category.Categoryimage = upLoadImage;

                    if (categoryImage != null && categoryImage != "")
                    {
                        _fileManagerService.DeleteSingleImage(GetPath.CategoryImage + categoryImage);
                    }
                }
                else
                {
                    return "Đã xảy ra lỗi khi upload ảnh.";
                }
            }

            _unitOfWork.GetRepository<Category>().Update(category);
            await _unitOfWork.SaveChangesAsync();

            return "success";
        }

        private bool CategoryNameExists(string name)
        {
            var category = _unitOfWork.GetRepository<Category>().GetFirstOrDefault(
                               predicate: n => n.Categoryname.ToLower() == name.ToLower());
            return category != null;
        }

        private bool CategoryNameExists(string name, string id)
        {
            var category = _unitOfWork.GetRepository<Category>().GetFirstOrDefault(
                                predicate: n => (n.Categoryname.ToLower() == name.ToLower() && n.Categoryid != id));
            return category != null;
        }
    }
}
