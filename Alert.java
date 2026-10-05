package com.example.analytics.alerts;

import java.time.Instant;

public record Alert(
        String id,
        String severity,
        String title,
        String message,
        Instant createdAt
) {
}
