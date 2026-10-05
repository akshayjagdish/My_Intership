package com.example.analytics.search;

import java.time.Instant;

public record SearchDocument(
        String id,
        String type,
        String title,
        String body,
        String route,
        double score,
        Instant indexedAt
) {
}
