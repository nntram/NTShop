﻿using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models;
using NTShop.Models.CreateModels;

namespace NTShop.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CartRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<string> AddToCart(string customerId, AddToCartModel model)
        {
            var cart = await GetCart(customerId);
            var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                            predicate: p => (p.Productid == model.ProductId && p.Productisactive == true));

            if (product == null || cart == null ||
                (product != null && model.Quantity > product.Productquantity))
            {
                return "Yêu cầu không hợp lệ.";
            }

            var cartDetail = cart.Cartdetails;

            //check product in cart
            var isInCart = cartDetail.FirstOrDefault(n => n.Productid == model.ProductId);
            if (isInCart != null)
            {
                if (model.Quantity > 0 && model.Quantity + isInCart.Cartdetailquantity > product.Productquantity)
                {
                    return "Vượt quá số sản phẩm trong kho.";
                }
                if (model.Quantity < 0 && model.Quantity + isInCart.Cartdetailquantity < 1)
                {
                    return "Số lượng sản phẩm phải lớn hơn 1 hoặc xóa sản phẩm.";
                }
                isInCart.Cartdetailquantity += model.Quantity;
                _unitOfWork.GetRepository<Cartdetail>().Update(isInCart);
                _unitOfWork.SaveChanges();
            }
            else
            {
                Cartdetail item = new Cartdetail();
                item.Productid = model.ProductId;
                item.Cartdetailquantity = model.Quantity;
                item.Cartid = cart.Cartid;
                _unitOfWork.GetRepository<Cartdetail>().Insert(item);
                _unitOfWork.SaveChanges();
            }
            cart.Cartquantity += model.Quantity;
            _unitOfWork.GetRepository<Cart>().Update(cart);
            _unitOfWork.SaveChanges();

            return "success";
        }

        public async Task<int?> CheckAndUpdateCart(string customerId)
        {
            int result = 0;
            var cart = await GetCart(customerId);
            if (cart == null)
            {
                return null;
            }

            foreach(var item in cart.Cartdetails)
            {
                var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                    predicate: p => p.Productisactive == true 
                        && p.Productid == item.Productid 
                        && p.Productquantity > 0);

                if(product == null)
                {
                    var sub = item.Cartdetailquantity;
                    result += sub?? 0;
                    cart.Cartquantity -= sub;
                    _unitOfWork.GetRepository<Cartdetail>().Delete(item);
                    _unitOfWork.GetRepository<Cart>().Update(cart);
                    _unitOfWork.SaveChanges();
                    continue;
                }

                if(item.Cartdetailquantity > product.Productquantity)
                {
                    var sub = item.Cartdetailquantity - product.Productquantity;
                    result += sub?? 0;
                    cart.Cartquantity -= sub;
                    item.Cartdetailquantity = product.Productquantity;                    
                    _unitOfWork.GetRepository<Cartdetail>().Update(item);
                    _unitOfWork.GetRepository<Cart>().Update(cart);
                    _unitOfWork.SaveChanges();
                }

            }

            return result;
        }

        public async Task<int?> GetCartQuantity(string cusomterId)
        {
            var cart = await GetCart(cusomterId);
            if(cart != null)
            {
                return cart.Cartquantity;
            }

            return null;
        }

        public async Task<CartModel> GetCustomerCart(string cusomterId)
        {
            var customer = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync(
                       predicate: p => p.Customerid == cusomterId && p.Customerisactive == true);
            if (customer == null)
            {
                return null;
            }
            var cart = await _unitOfWork.GetRepository<Cart>().GetFirstOrDefaultAsync(
                        predicate: p => p.Customerid == cusomterId,
                        include: p => p.Include(n => n.Cartdetails)
                                        .ThenInclude(n => n.Product)
                                        .ThenInclude(n => n.Productimages)
                                        );
            if(cart == null)
            {
                var createCart = new Cart();
                createCart.Customerid = cusomterId;
                createCart.Cartquantity = 0;

                var newCart = await _unitOfWork.GetRepository<Cart>().InsertAsync(createCart);
                _unitOfWork.SaveChanges();

                return _mapper.Map<CartModel>(newCart.Entity);
            }

            return _mapper.Map<CartModel>(cart);
        }

     
        public async Task<string> Remove(string cartDetailtId)
        {
            var cartDetail = await _unitOfWork.GetRepository<Cartdetail>().FindAsync(cartDetailtId);

            if (cartDetail == null)
            {
                return "Không tìm thấy thông tin phù hợp.";
            }

            var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                    predicate: p => (p.Productisactive == true && p.Productid == cartDetail.Productid));
            var cart = await _unitOfWork.GetRepository<Cart>().FindAsync(cartDetail.Cartid);

            if (cart == null)
            {
                return "Giỏ hàng không tồn tại.";
            }
            if (product == null)
            {
                return "Sản phẩm hiện không có trong giỏ hàng.";
            }

            var quantity = cartDetail.Cartdetailquantity;
            _unitOfWork.GetRepository<Cartdetail>().Delete(cartDetail);
            await _unitOfWork.SaveChangesAsync();

            cart.Cartquantity -= quantity;
            _unitOfWork.GetRepository<Cart>().Update(cart);
            await _unitOfWork.SaveChangesAsync();
            return "success";
        }

        private async Task<Cart> GetCart(string cusomterId)
        {
            var customer = await _unitOfWork.GetRepository<Customer>().GetFirstOrDefaultAsync(
                       predicate: p => p.Customerid == cusomterId && p.Customerisactive == true);
            if (customer == null)
            {
                return null;
            }
            var cart = await _unitOfWork.GetRepository<Cart>().GetFirstOrDefaultAsync(
                        predicate: p => p.Customerid == cusomterId,
                        include: p => p.Include(n => n.Cartdetails));
            if (cart == null)
            {
                var createCart = new Cart();
                createCart.Customerid = cusomterId;
                createCart.Cartquantity = 0;

                var newCart = await _unitOfWork.GetRepository<Cart>().InsertAsync(createCart);
                _unitOfWork.SaveChanges();

                return newCart.Entity;
            }

            return cart;
        }
    }
}
