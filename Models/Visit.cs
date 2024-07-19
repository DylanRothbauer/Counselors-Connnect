using System.ComponentModel.DataAnnotations;

namespace Counselors_Connect.Models
{
    public class Visit
    {
        [Key]
        [Required]
        public int VisitID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [Required]
        public int CounselorID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public bool File { get; set; } 

        [Required]
        public bool ParentsCalled { get; set; }

        [Required]
        public int Length { get; set; }
        //public ICollection<Topic> Topics { get; }


    }
}
