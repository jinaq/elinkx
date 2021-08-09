using System.Text.Json.Serialization;

namespace ELinkx.Model
{
    public class GlobalError
    {
        public GlobalError(string v)
        {
            this.Errors = new Error();
            this.Errors.Global = v;
        }

        
        public Error Errors { get; set; }
    }
}