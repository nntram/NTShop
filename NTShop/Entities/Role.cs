using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace NTShop.Entities
{
    [Table("ROLE")]
    public partial class Role
    {
        public Role()
        {
            staff = new HashSet<staff>();
        }

        [Key]
        [Column("ROLEID")]
        [StringLength(64)]
        public string Roleid { get; set; } = null!;
        [Column("ROLENAME")]
        [StringLength(256)]
        public string? Rolename { get; set; }

        [InverseProperty("Role")]
        public virtual ICollection<staff> staff { get; set; }
    }
}
