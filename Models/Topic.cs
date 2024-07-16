using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Counselors_Connect.Models
{
    public class Topic
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        [Required]
        public int TopicID { get; set; }

        [Required]
        public string TopicName { get; set; }
    }
}
