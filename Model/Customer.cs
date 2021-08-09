using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using ELinkx.Validation;

namespace ELinkx.Model
{
    public class Customer
    {


        [JsonPropertyName("ID")] public int ID { get; set; }
        
        [Required]
        [MinLength(3)]
        [JsonPropertyName("Name")] public string Name { get; set; }
        
        [Required]
        [ICOValidation]
        [JsonPropertyName("ICO")] public string ICO { get; set; }
    }
}