using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NTShop.Models
{
    public class RoleModel
    {
        public string Roleid { get; set; } = null!;
        public string? Rolename { get; set; }
    }
}
