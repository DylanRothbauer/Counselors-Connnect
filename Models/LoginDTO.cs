using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Counselors_Connect.Models
{
    public class LoginDTO
    {
        [Required]
        public string Username { get; set; }    

        [Required]
        public string Password { get; set; }    
    }
}
