using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.CheckoutModels;

namespace NTShop.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CheckoutResponse> CreatetAsync(OrderModel model, CartModel cart)
        {       
            var result = new CheckoutResponse();
            int totalPrice = 0;
            var order = new Order();
            order.Customerid = model.Customerid;
            order.Orderadress = model.Orderadress;
            order.Orderphonenumber = model.Orderphonenumber;
            order.Orderid = Guid.NewGuid().ToString();
            order.Orderstatusid = "0";
            order.Orderispaid = false;
            try
            {
                List<Product> products = new List<Product>();

                //check product quanity before add order
                foreach (var item in cart.Cartdetails)
                {
                    var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: p => (p.Productisacitve == true && p.Productid == item.Productid));
                    if (product == null || product.Productquantity < item.Cartdetailquantity)
                    {
                        result.Status = "Số lượng sản phẩm trong kho hiện không đủ.";
                        return result;
                    }
                    products.Add(product);
                }

                _unitOfWork.GetRepository<Order>().Insert(order);
                _unitOfWork.SaveChanges();

                result.OrderId = order.Orderid;                
                int n = cart.Cartdetails.Count;
                for(int i=0; i<n; i++)
                {
                    var item = cart.Cartdetails[i];
                    var product = products[i];
                    
                    Orderdetail orderdetail = new Orderdetail();
                    orderdetail.Orderid = order.Orderid;
                    orderdetail.Productid = item.Productid;
                    orderdetail.Orderdetailquantity = item.Cartdetailquantity;
                    orderdetail.Orderdetailprice = product.Productprice;
                    _unitOfWork.GetRepository<Orderdetail>().Insert(orderdetail);;

                    var cartDetail = _unitOfWork.GetRepository<Cartdetail>().Find(item.Cartdetailid);
                    _unitOfWork.GetRepository<Cartdetail>().Delete(cartDetail);

                    //update product quantity
                    product.Productquantity -= item.Cartdetailquantity;
                    _unitOfWork.GetRepository<Product>().Update(product);

                    totalPrice += (int)item.Cartdetailquantity * (int)product.Productsaleprice;
                }
                var updateCart = await _unitOfWork.GetRepository<Cart>().FindAsync(cart.Cartid);
                updateCart.Cartquantity = 0;
                _unitOfWork.GetRepository<Cart>().Update(updateCart);
                _unitOfWork.SaveChanges();
               
            }
            catch(Exception ex)
            {
                result.Status = "Đã xảy ra lỗi";
                return result;
            }

            result.OrderTotalPrice = totalPrice;
            result.Status = "success";
            return result;

        }

        public async Task<List<OrderModel>> GetCustomerOrders(string cusomterId)
        {
            var data = (await _unitOfWork.GetRepository<Order>().GetPagedListAsync(
                        pageSize: int.MaxValue,
                        predicate: p => p.Customerid == cusomterId,
                        include: p => p.Include(m => m.Orderdetails)
                                        .ThenInclude(m => m.Product))).Items;

            return _mapper.Map<List<OrderModel>>(data);
        }

        public async Task<bool> UpdateOrderPaidStatus(string orderId)
        {
            var data = await _unitOfWork.GetRepository<Order>().FindAsync(orderId);
            if(data == null) return false;

            data.Orderispaid = true;
            _unitOfWork.GetRepository<Order>().Update(data);
            _unitOfWork.SaveChanges();
            return true;
        }
    }
}
