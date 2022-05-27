using Core.Interfaces;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDatabase _database;

        public ResponseCacheService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task CacheResponse(string key, object value, TimeSpan timeToLive)
        {
            if (value == null)
            {
                return;
            }
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };

            var serializedValue = JsonSerializer.Serialize(value, options);

            await _database.StringSetAsync(key, serializedValue, timeToLive);
        }

        public async Task<string> GetCachedResponse(string key)
        {
            var cachedValue = await _database.StringGetAsync(key);

            if (cachedValue.IsNullOrEmpty) return null;

            return cachedValue;
        }
    }
}
