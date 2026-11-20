using System.Text.Json.Serialization;

namespace Reznik_WebApp.Server.Models
{
    public class PuppyImage
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;

        public int PuppyId { get; set; }
        [JsonIgnore]
        public Puppy? Puppy { get; set; }
    }
}