using Arch.EntityFrameworkCore.UnitOfWork;
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
                            predicate: p => (p.Productid == model.ProductId && p.Productisacitve == true));

            if (product == null || cart == null || model.Quantity < 1 ||
                (product != null && model.Quantity > product.Productquantity))
            {
                return "Yêu cầu không hợp lệ.";
            }

            var cartDetail = cart.Cartdetails;

            //check product in cart
            var isInCart = cartDetail.FirstOrDefault(n => n.Productid == model.ProductId);
            if (isInCart != null)
            {
                if (model.Quantity + isInCart.Cartdetailquantity > product.Productquantity)
                {
                    return "Vượt quá số sản phẩm trong kho.";
                }
                isInCart.Cartdetailquantity += model.Quantity;
                _unitOfWork.GetRepository<Cartdetail>().Update(isInCart);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                Cartdetail item = new Cartdetail();
                item.Productid = model.ProductId;
                item.Cartdetailquantity = model.Quantity;
                item.Cartid = cart.Cartid;
                await _unitOfWork.GetRepository<Cartdetail>().InsertAsync(item);
                _unitOfWork.SaveChanges();
            }
            cart.Cartquantity += model.Quantity;
            _unitOfWork.GetRepository<Cart>().Update(cart);
            await _unitOfWork.SaveChangesAsync();

            return "success";
        }

        public Task<string> DecreaseOne(string cartDetailtId)
        {
            throw new NotImplementedException();
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
                        include: p => p.Include(n => n.Cartdetails));
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

        public Task<string> IncreaseOne(string cartDetailtId)
        {
            throw new NotImplementedException();
        }

        public Task<string> Remove(string cartDetailtId)
        {
            throw new NotImplementedException();
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
