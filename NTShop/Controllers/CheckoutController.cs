﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTShop.Helpers;
using NTShop.Models;
using NTShop.Models.CheckoutModels;
using NTShop.Repositories.Interface;
using NTShop.Services.Interface;
using System.IO;

namespace NTShop.Controllers
{
    [Route("checkout")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;

        public CheckoutController(IConfiguration configuration, ITokenService tokenService,
            IOrderRepository orderRepository, ICartRepository cartRepository)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
        }

        private string Payment(PaymentModel model)
        {
            string url = _configuration["VNPay:Url"];
            string returnUrl = _configuration["VNPay:ReturnUrl"];
            string tmnCode = _configuration["VNPay:TmnCode"];
            string hashSecret = _configuration["VNPay:HashSecret"];

            PayLib pay = new PayLib();

            pay.AddRequestData("vnp_Version", "2.1.0"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.1.0
            pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
            pay.AddRequestData("vnp_TmnCode", tmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
            pay.AddRequestData("vnp_Amount", (model.OrderTotalPrice * 100).ToString()); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
            pay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
            pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
            pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
            pay.AddRequestData("vnp_IpAddr", _tokenService.GetIpAddress()); //Địa chỉ IP của khách hàng thực hiện giao dịch
            pay.AddRequestData("vnp_Locale", "vn"); //Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
            pay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang " + model.OrderId); //Thông tin mô tả nội dung thanh toán
            pay.AddRequestData("vnp_OrderType", "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
            pay.AddRequestData("vnp_ReturnUrl", returnUrl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
            pay.AddRequestData("vnp_TxnRef", model.OrderId); //mã hóa đơn

            string paymentUrl = pay.CreateRequestUrl(url, hashSecret);

            return paymentUrl;
        }
        [HttpGet("payment-confirm")]
        public IActionResult PaymentConfirm()
        {
            string result = "Lỗi không xác định được yêu cầu.";
            if (Request.Query.Count > 0)
            {

                string hashSecret = _configuration["VNPay:HashSecret"]; //Chuỗi bí mật
                var vnpayData = Request.Query;
                PayLib pay = new PayLib();

                //lấy toàn bộ dữ liệu được trả về
                foreach (var key in vnpayData.Keys)
                {
                    if (!string.IsNullOrEmpty(vnpayData[key]) && key.StartsWith("vnp_"))
                    {
                        pay.AddResponseData(key, vnpayData[key].ToString());
                    }
                }

                string orderId = pay.GetResponseData("vnp_TxnRef"); //mã hóa đơn
                long vnpayTranId = Convert.ToInt64(pay.GetResponseData("vnp_TransactionNo")); //mã giao dịch tại hệ thống VNPAY
                string vnp_ResponseCode = pay.GetResponseData("vnp_ResponseCode"); //response code: 00 - thành công, khác 00 - xem thêm https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
                string vnp_SecureHash = Request.Query["vnp_SecureHash"].ToString(); //hash của dữ liệu trả về

                bool checkSignature = pay.ValidateSignature(vnp_SecureHash, hashSecret); //check chữ ký đúng hay không?

                if (checkSignature)
                {
                    if (vnp_ResponseCode == "00")
                    {
                        var update = _orderRepository.UpdateOrderPaidStatus(orderId);
                        //Thanh toán thành công
                        result = "Thanh toán thành công hóa đơn " + orderId + " | Mã giao dịch: " + vnpayTranId;
                    }
                    else
                    {
                        //Thanh toán không thành công. Mã lỗi: vnp_ResponseCode
                        result = "Có lỗi xảy ra trong quá trình xử lý hóa đơn " + orderId + " | Mã giao dịch: " + vnpayTranId + " | Mã lỗi: " + vnp_ResponseCode;
                    }
                }
                else
                {
                    result = "Có lỗi xảy ra trong quá trình xử lý";
                }
            }

            var path = "response/" + result;
            path = String.Join("/", path.Split("/").Select(s => System.Net.WebUtility.UrlEncode(s)));
            return Redirect(_configuration["WebApplication"] + path);
        }

        [HttpPost("")]
        public async Task<IActionResult> Checkout([FromForm] OrderModel model)
        {
            var cart = await _cartRepository.GetCustomerCart(model.Customerid);
            if (cart == null)
            {
                return NotFound();
            }
            var data = await _orderRepository.CreatetAsync(model, cart);
            if (data.Status != "success")
            {
                return BadRequest(data.Status);

            }
            if (model.PaymentType == "VNPay")
            {
                var paymentModel = new PaymentModel();
                paymentModel.OrderTotalPrice = data.OrderTotalPrice;
                paymentModel.OrderId = data.OrderId;
                var paymentUrl = Payment(paymentModel);
                return Ok(paymentUrl);
            }

            return Ok("Đặt hàng thành công.");


        }



    }
}
