using System.Net;
namespace SPC.Data.Models;

public class BaseMessage<T>
where T : class
{
    public string Message { get; set; } = string.Empty;
    public HttpStatusCode StatusCode { get; set; }
    public int TotalElements { get; set; }
    public List<T> ResponseElements { get; set; }
}