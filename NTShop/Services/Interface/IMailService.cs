using NTShop.Models.CreateModels;
using NTShop.Models.SendMail;
using System.Net.Mail;

namespace NTShop.Services.Interface
{
    public interface IMailService
    {
        Task<string> SendMail(MailClass mailClass);

        string GetMailBody(string id, string username);

        string GetMailBodyToForgotPassword(string username, string token);
    }
}
