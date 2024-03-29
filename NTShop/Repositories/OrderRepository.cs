﻿using Arch.EntityFrameworkCore.UnitOfWork;
using AutoMapper;
using NTShop.Entities;
using NTShop.Models;
using NTShop.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using NTShop.Models.CheckoutModels;
using NTShop.Models.Filters;
using Abp.Linq.Expressions;
using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using NTShop.Models.UpdateModels;

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
            order.Ordercustomername = model.Ordercustomername;
            try
            {
                List<Product> products = new List<Product>();

                //check product quanity before add order
                foreach (var item in cart.Cartdetails)
                {
                    var product = await _unitOfWork.GetRepository<Product>().GetFirstOrDefaultAsync(
                        predicate: p => (p.Productisactive == true && p.Productid == item.Productid));
                    if (product == null || product.Productquantity < item.Cartdetailquantity)
                    {
                        result.Status = "Số lượng sản phẩm trong kho hiện không đủ.";
                        return result;
                    }
                    products.Add(product);
                    totalPrice += (int)item.Cartdetailquantity * (int)product.Productsaleprice;
                }
                order.Ordertotalamount = totalPrice;
                _unitOfWork.GetRepository<Order>().Insert(order);

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
                    orderdetail.Orderdetailprice = product.Productsaleprice;
                    _unitOfWork.GetRepository<Orderdetail>().Insert(orderdetail);

                    var cartDetail = _unitOfWork.GetRepository<Cartdetail>().Find(item.Cartdetailid);
                    _unitOfWork.GetRepository<Cartdetail>().Delete(cartDetail);

                    //update product quantity
                    product.Productquantity -= item.Cartdetailquantity;
                    _unitOfWork.GetRepository<Product>().Update(product);                    
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

        public async Task<OrderModel> GetByIdAsync(string id)
        {
            var data = await _unitOfWork.GetRepository<Order>().GetFirstOrDefaultAsync(
                        predicate: x => x.Orderid == id,
                        include: p => p.Include(m => m.Orderdetails)
                                       .ThenInclude(n => n.Product)
                                       .ThenInclude(q => q.Productimages));

            return _mapper.Map<OrderModel>(data);
        }

        public async Task<List<OrderModel>> GetCustomerOrders(string cusomterId)
        {
            var data = (await _unitOfWork.GetRepository<Order>().GetPagedListAsync(
                        pageSize: int.MaxValue,
                        predicate: p => p.Customerid == cusomterId,
                        include: p => p.Include(m => m.Orderdetails)
                                        .ThenInclude(m => m.Product),
                        orderBy: p => p.OrderByDescending(m => m.Ordercreateddate))).Items;

            return _mapper.Map<List<OrderModel>>(data);
        }

        public async Task<List<OrderStatusModel>> GetOrderStatus()
        {
            var data = (await _unitOfWork.GetRepository<Orderstatus>().GetPagedListAsync(
                        pageSize: int.MaxValue)).Items;

            return _mapper.Map<List<OrderStatusModel>>(data);
        }

        public async Task<PagedList<OrderModel>> GetPagedOrders(OrderGetpagedModel filter)
        {
            var predicate = PredicateBuilder.New<Order>(p => 
                    p.Ordercreateddate >= filter.BeginDate && p.Ordercreateddate <= filter.EndDate);
            if (filter.Orderispaid != null)
            {
                predicate = predicate.And(p => p.Orderispaid == filter.Orderispaid);
            }
            if (!string.IsNullOrEmpty(filter.Orderstatusid))
            {
                predicate = predicate.And(p => p.Orderstatusid == filter.Orderstatusid);
            }
            if (!string.IsNullOrEmpty(filter.Customerid))
            {
                predicate = predicate.And(p => p.Customerid == filter.Customerid);
            }
            if(filter.Ordercode > 0)
            {
                predicate = predicate.And(p => p.Ordercode == filter.Ordercode);
            }

            var data = await _unitOfWork.GetRepository<Order>().GetPagedListAsync(
                        pageIndex: filter.PageIndex,
                        pageSize: filter.PageSize,
                        predicate: predicate,
                        orderBy: p => p.OrderByDescending(m => m.Ordercreateddate));

            return _mapper.Map<PagedList<OrderModel>>(data);
        }

        public async Task<bool> UpdateOrderPaidStatus(string orderId)
        {
            var data = await _unitOfWork.GetRepository<Order>().FindAsync(orderId);
            if(data == null) return false;

            data.Orderispaid = true;
            try
            {
                _unitOfWork.GetRepository<Order>().Update(data);
                _unitOfWork.SaveChanges();
            }
            catch(Exception ex)
            {
                return false;
            }
           
            return true;
        }

        public async Task<bool> UpdateOrderStatus(OrderStatusUpdateModel model)
        {
            var data = await _unitOfWork.GetRepository<Order>().GetFirstOrDefaultAsync(
                predicate: p => p.Orderid == model.OrderId,
                include: p => p.Include(m => m.Orderdetails).ThenInclude(n => n.Product));
            if (data == null) return false;
            if (data.Orderstatusid == "-1" || data.Orderstatusid == "3") return false; //thanh cong va da huy

            data.Orderstatusid = model.OrderStatusId;
            data.Staffid = model.StaffId;
            _unitOfWork.GetRepository<Order>().Update(data);

            if(model.OrderStatusId == "-1") //huy don hang, hoan lai so luong san phan
            {
                var listOrderDetail = data.Orderdetails;
                foreach( var item in listOrderDetail)
                {
                    var product = await _unitOfWork.GetRepository<Product>().FindAsync(item.Product.Productid);
                    product.Productquantity += item.Orderdetailquantity;
                    _unitOfWork.GetRepository<Product>().Update(product);
                }
            }
            if (model.OrderStatusId == "3") //don thanh cong, tao hoa don
            {
                var listOrderDetail = data.Orderdetails;
                var invoice = new Invoice();
                invoice.Invoiceid = Guid.NewGuid().ToString();
                invoice.Staffid = model.StaffId;
                invoice.Orderid = model.OrderId;
                invoice.Customerid = data.Customerid;
                invoice.Invoiceadress = data.Orderadress;
                invoice.Invoicephonenumber = data.Orderphonenumber;
                invoice.Invoicecustomername = data.Ordercustomername;
                invoice.Invoicetotalamount = data.Ordertotalamount;
                _unitOfWork.GetRepository<Invoice>().Insert(invoice);

                foreach (var item in listOrderDetail)
                {
                    var invoiceDetail = new Invoicedetail();
                    invoiceDetail.Invoiceid = invoice.Invoiceid;
                    invoiceDetail.Invoicedetailquantity = item.Orderdetailquantity;
                    invoiceDetail.Invoicedetailprice = item.Orderdetailprice;
                    invoiceDetail.Productid = item.Productid;
                    _unitOfWork.GetRepository<Invoicedetail>().Insert(invoiceDetail);
                }
            }
            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }
    }
}
