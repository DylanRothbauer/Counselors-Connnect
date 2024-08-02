using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Counselors_Connect.Models
{
    public class Topic
    {
        [Key]
        [Required]
        public int TopicID { get; set; }

        [Required]
        public string TopicName { get; set; }

        [Required]
        public ICollection<VisitTopic> VisitTopics { get; set; }
    }
}
