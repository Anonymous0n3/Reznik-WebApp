namespace Reznik_WebApp.Server.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PreferredGender { get; set; } = "any";
        public int LitterId { get; set; }
        public Litter? Litter { get; set; }
    }
}