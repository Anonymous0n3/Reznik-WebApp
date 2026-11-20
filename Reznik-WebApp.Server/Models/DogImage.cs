using System.Text.Json.Serialization;

namespace Reznik_WebApp.Server.Models
{
    public class DogImage
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;

        public int DogId { get; set; }
        [JsonIgnore] // Zabrání zacyklení při vracení JSONu
        public Dog? Dog { get; set; }
    }
}