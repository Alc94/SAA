namespace ZooLogic.Models
{
    public class Animal
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string HealthStatus { get; set; } = "Normal"; // Para el enfoque IA
    }
}