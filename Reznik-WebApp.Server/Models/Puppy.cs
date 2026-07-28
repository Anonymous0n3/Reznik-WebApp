namespace Reznik_WebApp.Server.Models
{
    public class Puppy
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = "male";
        public string Status { get; set; } = "available";
        public string? ColorInfo { get; set; }
        public string? ImageUrl { get; set; }
        public int LitterId { get; set; }
        public Litter? Litter { get; set; }
    }
}