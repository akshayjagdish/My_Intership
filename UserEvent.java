package com.example.analytics.events;

import java.time.Instant;
import java.util.Map;

public record UserEvent(
        String id,
        String userId,
        String sessionId,
        String eventType,
        String route,
        String device,
        String country,
        double value,
        Instant occurredAt,
        Map<String, Object> attributes
) {
}
