package com.example.analytics.config;

import com.example.analytics.events.EventStreamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.Map;

@Configuration
@EnableConfigurationProperties(AnalyticsProperties.class)
public class WebSocketConfig {
    @Bean
    HandlerMapping webSocketMapping(EventStreamService events, ObjectMapper mapper) {
        WebSocketHandler handler = session -> session.send(
                events.liveMetrics()
                        .map(metric -> {
                            try {
                                return mapper.writeValueAsString(metric);
                            } catch (Exception ex) {
                                throw new IllegalStateException(ex);
                            }
                        })
                        .map(session::textMessage)
        );
        return new SimpleUrlHandlerMapping(Map.of("/ws/metrics", handler), -1);
    }

    @Bean
    WebSocketHandlerAdapter webSocketHandlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}
