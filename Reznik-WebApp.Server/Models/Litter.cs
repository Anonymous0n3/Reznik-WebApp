namespace Reznik_WebApp.Server.Models
{
    public class Litter
    {
        public int Id { get; set; }
        public string Status { get; set; } = "planned";
        public string ExpectedDate { get; set; } = string.Empty;
        public string ExpectedCount { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SireId { get; set; }
        public Dog? Sire { get; set; }
        public int DamId { get; set; }
        public Dog? Dam { get; set; }
        public List<Reservation> Reservations { get; set; } = new();
    }
}