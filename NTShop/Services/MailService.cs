using Microsoft.AspNetCore.Hosting;
using NTShop.Models.CreateModels;
using NTShop.Models.SendMail;
using NTShop.Services.Interface;
using System.Net.Mail;
using System.Xml.Linq;

namespace NTShop.Services
{
    public class MailService : IMailService
    {
        public IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetMailBody(string id, string username)
        {
            string url = _configuration["DomainName"] + "customers/confirm-mail?id=" + id;
            return string.Format(@"<div style='text-align:center;'>
                                    <h1>Nari Cosmetic kính chào bạn {0},</h1>
                                    <h3>Bấm vào nút bên dưới để xác nhận bạn đã đăng ký tài khoản tại website của chúng tôi.</h3>
                                    <form method='post' action='{1}' style='display: inline;'>
                                      <button type = 'submit' style=' display: block;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    background-color: #008CBA;
                                                                    font-size: 16px;
                                                                    border-radius: 10px;
                                                                    color:#ffffff;
                                                                    cursor:pointer;
                                                                    width:100%;
                                                                    padding:10px;'>
                                        Xác nhận mail
                                      </button>
                                    </form>
                                </div>", username, url);
        }

        public string GetMailBodyToForgotPassword(string username, string token)
        {
            string url = _configuration["WebApplication"] + "reset-password/"+ token ;
            return string.Format(@"<div style='text-align:center;'>
                                    <h1>Nari Cosmetic kính chào bạn {0},</h1>
                                    <h3>Bấm vào nút bên dưới để thay đổi mật khẩu (Hiệu lực trong 30 phút.).</h3>
                                    
                                      <a href = {1} style=' display: block;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    background-color: #008CBA;
                                                                    font-size: 16px;
                                                                    border-radius: 10px;
                                                                    color:#ffffff;
                                                                    cursor:pointer;
                                                                    width:100%;
                                                                    padding:10px;'>
                                        Đổi mật khẩu
                                      </a>
                                    
                                </div>", username, url);
        }

        public async Task<string> SendMail(MailClass mailClass)
        {
            try
            {
                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(mailClass.FromMail);
                    mailClass.ToMails.ForEach(x =>
                    {
                        mail.To.Add(x);
                    });

                    mail.Subject = mailClass.Subject;
                    mail.Body = mailClass.Body;
                    mail.IsBodyHtml = mailClass.IsBodyHtml;
                    mailClass.Attachments.ForEach(x =>
                    {
                        mail.Attachments.Add(new Attachment(x));
                    });

                    using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(mailClass.FromMail, mailClass.FromMailPassword);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mail);
                        return MessageMail.MailSent;
                    }
                }
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }


    }
}
