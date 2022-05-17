using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",
            ErrorMessage = "The password 1 small-case letter, 1 Capital letter, 1 digit," +
            " 1 special character and the length should be between 6-10 characters. The sequence of the characters is not important.")]
        public string? Password { get; set; }

        [Required]
        public string? DisplayName { get; set; }
    }
}
