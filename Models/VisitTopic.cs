using System.ComponentModel.DataAnnotations.Schema;

namespace Counselors_Connect.Models
{
    public class VisitTopic
    {
        public int VisitID { get; set; }
        public Visit Visit { get; set; }

        public int TopicID { get; set; }
        public Topic Topic { get; set; }
    }
}
