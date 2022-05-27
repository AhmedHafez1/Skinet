using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IResponseCacheService
    {
        Task CacheResponse(string key, object value, TimeSpan timeToLive);
        Task<string> GetCachedResponse(string key);
    }
}
