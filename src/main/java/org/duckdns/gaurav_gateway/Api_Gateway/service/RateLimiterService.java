package org.duckdns.gaurav_gateway.Api_Gateway.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

@Service
public class RateLimiterService {

    private final int limit;
    private final int window; // seconds
    private final Jedis jedis = new Jedis("localhost", 6379);

    public RateLimiterService(
            @Value("${rate-limiter.limit}") int limit,
            @Value("${rate-limiter.window}") int window) {
        this.limit = limit;
        this.window = window;
    }

    public boolean isAllowed(String ip) {
        String key = "rate:" + ip;
        long count = jedis.incr(key);

        if (count == 1) {
            jedis.expire(key, window);
        }

        return count <= limit;
    }
}
