package org.duckdns.gaurav_gateway.Api_Gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "loadbalancer")
public class LoadBalancerConfig {

    private List<ServiceConfig> services;

    public List<ServiceConfig> getServices() {
        return services;
    }
    public void setServices(List<ServiceConfig> services) {
        this.services = services;
    }

    public static class ServiceConfig {
        private String group;
        private String location;
        private List<String> hosts;

        public String getGroup() { return group; }
        public void setGroup(String group) { this.group = group; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public List<String> getHosts() { return hosts; }
        public void setHosts(List<String> hosts) { this.hosts = hosts; }
    }
}

