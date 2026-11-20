namespace Reznik_WebApp.Server.Models
{
    public class Dog
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsReserved { get; set; } = false;

        // Nová relace: Jeden pes má více fotek
        public List<DogImage> Images { get; set; } = new List<DogImage>();
    }
}