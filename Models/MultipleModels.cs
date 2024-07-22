namespace Counselors_Connect.Models
{
    public class MultipleModels
    {
        public IEnumerable<Visit> Visits { get; set; } = new List<Visit>();
        public IEnumerable<Student> Students { get; set; } = new List<Student>();
    }
}
