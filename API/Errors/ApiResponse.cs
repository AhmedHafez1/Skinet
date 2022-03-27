namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string? message = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetMessage();
        }

        public int StatusCode { get; set; }
        public string? Message { get; set; }

        private string? GetMessage()
        {
            return StatusCode switch
            {
                400 => "A bad Request",
                500 => "Server Error",
                404 => "Resource Not Found",
                401 => "You are not Authorized",
                _ => null
            };
        }
    }
}
