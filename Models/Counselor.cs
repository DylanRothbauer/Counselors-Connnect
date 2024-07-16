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
        public ICollection<Visit> Visits { get; }
    }
}
