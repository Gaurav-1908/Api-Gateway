package org.duckdns.gaurav_gateway.Api_Gateway.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.duckdns.gaurav_gateway.Api_Gateway.config.LoadBalancerConfig;
import org.duckdns.gaurav_gateway.Api_Gateway.service.RateLimiterService;;


@RestController
public class GatewayController {

    @Autowired
    private LoadBalancerConfig config;

    @Autowired
    private RateLimiterService rateLimiter;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, Integer> counters = new ConcurrentHashMap<>();

    @RequestMapping("/**")
    public ResponseEntity<?> proxy(HttpServletRequest request, @RequestBody(required = false) String body) {
        try{
                    String ip = request.getRemoteAddr();

        // Rate limit check
        if (!rateLimiter.isAllowed(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests, try again later.");
        }

        String path = request.getRequestURI();
        LoadBalancerConfig.ServiceConfig service = config.getServices().stream()
                .filter(s -> path.startsWith(s.getLocation()))
                .findFirst()
                .orElse(null);

        if (service == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching service");
        }

        // Round robin
        counters.putIfAbsent(service.getGroup(), 0);
        int index = counters.get(service.getGroup());
        String target = service.getHosts().get(index);
        counters.put(service.getGroup(), (index + 1) % service.getHosts().size());

        // Forward request
        String forwardUrl = target + path.replace(service.getLocation(), "");
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        HttpHeaders headers = new HttpHeaders();
        Collections.list(request.getHeaderNames())
                .forEach(h -> headers.add(h, request.getHeader(h)));

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(forwardUrl, method, entity, String.class);

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                                 .body("Backend unavailable: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Unexpected error: " + e.getMessage());
        }

    }
}
