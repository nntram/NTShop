namespace NTShop.Services.Interfaces
{
    public interface IFileManagerService
    {
        public Task<List<string>> UploadMultipleImages(IEnumerable<IFormFile> postedFiles, string path);
        public Task<string> UploadSingleImage(IFormFile postedFile, string path);

        public void DeleteMultipleImages(List<string> listPath);
        public void DeleteSingleImage(string path);

        public string UploadSingleImage2(IFormFile postedFile, string path);
    }
}
