﻿using System.ComponentModel.DataAnnotations;

namespace NTShop.Models.AuthModel
{
    public class LoginModel
    {
        [Required]
        public string UserName { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string Token { get; set; } = null!;


    }
}
