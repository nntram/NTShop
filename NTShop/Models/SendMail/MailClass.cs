namespace NTShop.Models.SendMail
{
    public class MailClass
    {
 
        public string FromMail { get; set; } = "tramb9531@gmail.com";
        public string FromMailPassword { get; set; } = "gvehooglkdylqwrp";
        public List<string> ToMails { get; set; } = new List<string>();
        public string Subject { get; set; } = "";
        public string Body { get; set; } = "";
        public bool IsBodyHtml { get; set; } = true;
        public List<string> Attachments { get; set; } = new List<string>();
    }
}
