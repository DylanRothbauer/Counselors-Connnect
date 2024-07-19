using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Counselors_Connect.Models
{
    public class Counselor
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        [Required]
        public int CounselorID { get; set; }

        [Required]
        public string Name { get; set;}

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }    
        public ICollection<Visit> Visits { get; }
    }
}
