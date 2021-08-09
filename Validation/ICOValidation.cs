using System;
using System.ComponentModel.DataAnnotations;
using System.IO;

namespace ELinkx.Validation
{
    public class ICOValidation : ValidationAttribute
    {
        public ICOValidation() : base("{0} value is not IC")
        {
            
        }

        protected override ValidationResult IsValid(object value, ValidationContext ctx)
        {
            var vaha = new int[]
            {
                8,7,6,5,4,3,2,0
            };
            
            if (value is string ico && ico.Length == vaha.Length)
            {
                int sum = 0;
                int last = 0;
                int pos = 0;
                foreach (var v in ico)
                {
                    int item = 0;
                    if (Int32.TryParse(v +"", out item))
                    {
                        sum += item * vaha[pos];
                        last = item;
                        pos++;
                    }
                    else
                    {
                        return new ValidationResult(base.FormatErrorMessage(ctx.MemberName == null ? "??": ctx.MemberName));
                    }
                }   
                if ((11 - (sum % 11)) % 10 == last)
                {
                    return null;
                } 
                return new ValidationResult(base.FormatErrorMessage(ctx.MemberName == null ? "??": ctx.MemberName));
                
            }
            return new ValidationResult(base.FormatErrorMessage(ctx.MemberName == null ? "??": ctx.MemberName));
        }
    }
}