using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.Filters;
using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using Abp.Linq.Expressions;
using NTShop.Models.CreateModels;
using NTShop.Models.UpdateModels;
using NTShop.Services.Interfaces;
using NTShop.Helpers;

namespace NTShop.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileManagerService _fileManagerService;

        public ProductRepository(IUnitOfWork unitOfWork, IMapper mapper,
            IFileManagerService fileManagerService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileManagerService = fileManagerService;
        }

        public async Task<List<ProductModel>> GetAllAsync()
        {
            var data = (await _unitOfWork.GetRepository<Product>().GetPagedListAsync(
                        pageSize: int.MaxValue,
                        predicate: p => p.Productisactive == true,
                        include: source => source.Include(m => m.Productimages)
                                                   .Include(m => m.Brand)
                                                   .Include(m => m.Category))).Items;

            return _mapper.Map<List<ProductModel>>(data);
        }

        public async Task<ProductModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: x => x.Productid == id,
                        include: source => source.Include(m => m.Productimages)
                                                  .Include(m => m.Brand)
                                                  .Include(m => m.Category));

            return _mapper.Map<ProductModel>(data);
        }

        public async Task<PagedList<ProductCardModel>> GetAllCardAsync(ProductFilterModel filter)
        {
            var predicate = PredicateBuilder.New<Product>(p => p.Productisactive == filter.Productisactive);
            if (!string.IsNullOrEmpty(filter.Productid))
            {
                predicate = predicate.And(p => p.Productid == filter.Productid);
            }
            if (!string.IsNullOrEmpty(filter.Brandid))
            {
                predicate = predicate.And(p => p.Brandid == filter.Brandid);
            }
            if (!string.IsNullOrEmpty(filter.Categoryid))
            {
                predicate = predicate.And(p => p.Categoryid == filter.Categoryid);
            }
            if (!string.IsNullOrEmpty(filter.Productname))
            {
                var filterName = filter.Productname.Trim().ToLower();
                predicate = predicate.And(p =>
                                   p.Productname.Trim().ToLower().Contains(filterName));

            }
            if (filter.Productishot == true)
            {
                predicate = predicate.And(p =>
                    p.Productishot == true);
            }
            if (filter.Productsmallquantity == true)
            {
                predicate = predicate.And(p =>
                    p.Productquantity <= 5);
            }
            var pages = await _unitOfWork.GetRepository<Product>().GetPagedListAsync(

                     pageSize: filter.PageSize,
                     pageIndex: filter.PageIndex,
                     include: source => source.Include(m => m.Productimages)
                                                  .Include(m => m.Brand)
                                                  .Include(m => m.Category),
                     predicate: predicate,
                     orderBy: p =>
                        (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "ascending") ?
                            p.OrderBy(s => s.Productsaleprice) :
                         (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "descending") ?
                            p.OrderByDescending(s => s.Productsaleprice) :
                        (filter != null && !string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy == "lastest") ?
                            p.OrderByDescending(s => s.Productcreateddate) :
                         p.OrderBy(s => s.Productid)

                   );


            var result = _mapper.Map<PagedList<ProductCardModel>>(pages);
            return result;
        }

        public async Task<string> Create(ProductCreateModel model)
        {
            if (model.ProductImageFiles != null)
            {
                foreach (var item in model.ProductImageFiles)
                {
                    var checkImageFile = FileValid.IsImageValid(item);
                    if (!checkImageFile)
                    {
                        return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";
                    }
                }

                if (ProductNameExists(model.Productname))
                {
                    return "Tên đã tồn tại.";
                }

                var product = _mapper.Map<Product>(model);
                product.Productid = Guid.NewGuid().ToString();
                _unitOfWork.GetRepository<Product>().Insert(product);

                foreach (var item in model.ProductImageFiles)
                {
                    if (item.Length > 0)
                    {
                        var upLoadImage = await _fileManagerService.UploadSingleImage(item, GetPath.ProductImage);
                        if (upLoadImage.Length > 0)
                        {
                            var productImage = new Productimage();
                            productImage.Productid = product.Productid;
                            productImage.Productimageurl = upLoadImage;
                            _unitOfWork.GetRepository<Productimage>().Insert(productImage);
                        }
                        else
                        {
                            return "Đã xảy ra lỗi khi upload ảnh.";
                        }
                    }                

                }
                 _unitOfWork.SaveChanges();
                return "success";

            }
            return "Không tìm thấy ảnh.";
        }

        public async Task<string> Update(ProductUpdateModel model)
        {
            var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                            predicate: p => p.Productid == model.Productid,
                            include: p => p.Include(n => n.Productimages));
            if (product == null)
            {
                return "Sản phẩm không tồn tại.";
            }
            if (model.ProductImageFiles != null)
            {
                foreach (var item in model.ProductImageFiles)
                {
                    var checkImageFile = FileValid.IsImageValid(item);
                    if (!checkImageFile)
                    {
                        return "Đã xảy ra lỗi. Định dạng ảnh không hợp lệ.";
                    }
                }

                if (ProductNameExists(model.Productname, model.Productid))
                {
                    return "Tên đã tồn tại.";
                }
              
                var productImages = product.Productimages;
                if (productImages != null)
                {
                    foreach (var item in productImages)
                    {
                        var productImage = _unitOfWork.GetRepository<Productimage>().Find(item.Productimageid);
                        _unitOfWork.GetRepository<Productimage>().Delete(productImage);
                        _unitOfWork.SaveChanges();
                        _fileManagerService.DeleteSingleImage(GetPath.ProductImage + item.Productimageurl);
                    }
                }

                foreach (var item in model.ProductImageFiles)
                {
                    if (item.Length > 0)
                    {
                        var upLoadImage = await _fileManagerService.UploadSingleImage(item, GetPath.ProductImage);
                        if (upLoadImage.Length > 0)
                        {
                            var productImage = new Productimage();
                            productImage.Productid = product.Productid;
                            productImage.Productimageurl = upLoadImage;
                            _unitOfWork.GetRepository<Productimage>().Insert(productImage);
                            _unitOfWork.SaveChanges();
                        }
                        else
                        {
                            return "Đã xảy ra lỗi khi upload ảnh.";
                        }
                    }

                }
                var updatedProduct = _unitOfWork.GetRepository<Product>().Find(model.Productid);
                _mapper.Map(model, updatedProduct);
                _unitOfWork.GetRepository<Product>().Update(updatedProduct);
                _unitOfWork.SaveChanges();
                return "success";

            }
            return "Không tìm thấy ảnh.";
        }

        public async Task<string> Delete(string id)
        {
            var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                predicate: p => p.Productid == id,
                include: p => p.Include(n => n.Productimages));
            if (product != null)
            {
                var cart = await _unitOfWork.GetRepository<Cartdetail>().GetFirstOrDefaultAsync(
                                predicate: n => n.Productid == id);
                var order = await _unitOfWork.GetRepository<Orderdetail>().GetFirstOrDefaultAsync(
                                predicate: n => n.Productid == id);
                var invoice = await _unitOfWork.GetRepository<Invoicedetail>().GetFirstOrDefaultAsync(
                                predicate: n => n.Productid == id); 
                if(cart != null || order != null || invoice != null)
                {
                    product.Productisactive = false;
                    _unitOfWork.GetRepository<Product>().Update(product);
                    _unitOfWork.SaveChanges();
                    return "update";
                }

                var productImages = product.Productimages;
                if (productImages != null)
                {
                    foreach(var item in productImages)
                    {
                        var productImage = _unitOfWork.GetRepository<Productimage>().Find(item.Productimageid);
                        _unitOfWork.GetRepository<Productimage>().Delete(productImage);
                        _unitOfWork.SaveChanges();
                        _fileManagerService.DeleteSingleImage(GetPath.ProductImage + item.Productimageurl);
                    }
                }
                var deleteProduct = _unitOfWork.GetRepository<Product>().Find(id);
                _unitOfWork.GetRepository<Product>().Delete(deleteProduct);
                _unitOfWork.SaveChanges();
                return "success";
            }
            return "404";
        }

        private bool ProductNameExists(string name)
        {
            var product = _unitOfWork.GetRepository<Product>().GetFirstOrDefault(
                               predicate: n => n.Productname.ToLower() == name.ToLower());
            return product != null;
        }

        private bool ProductNameExists(string name, string id)
        {
            var product = _unitOfWork.GetRepository<Product>().GetFirstOrDefault(
                                predicate: n => (n.Productname.ToLower() == name.ToLower() && n.Productid != id));
            return product != null;
        }
    }


}
