namespace NTShop.Models.AuthModels
{
    public class RecaptchaResponseModel
    {
        public bool success { get; set; }
        public double score { get; set; }
        public string action { get; set; }
        public DateTime chanllenge_ts { get; set; }
        public string hostname { get; set; }
    }
}
