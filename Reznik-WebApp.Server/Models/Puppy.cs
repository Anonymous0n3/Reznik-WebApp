namespace Reznik_WebApp.Server.Models
{
    public class Puppy
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Status { get; set; } = "available";
        public string? ColorInfo { get; set; }

        public int LitterId { get; set; }
        public Litter? Litter { get; set; }

        // ZMĚNA: Přidáno pole pro fotky místo jednoho ImageUrl
        public List<PuppyImage> Images { get; set; } = new List<PuppyImage>();
    }
}