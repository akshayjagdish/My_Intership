package com.example.ecommerce.config;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.Role;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class JwtService {
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long tokenTtlSeconds;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.security.jwt-secret:change-this-development-secret-before-production}") String secret,
            @Value("${app.security.jwt-ttl-seconds:86400}") long tokenTtlSeconds) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.tokenTtlSeconds = tokenTtlSeconds;
    }

    public TokenDetails createToken(AppUser user) {
        Instant expiresAt = Instant.now().plusSeconds(tokenTtlSeconds);
        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = new TreeMap<>();
        payload.put("sub", user.getEmail());
        payload.put("name", user.getName());
        payload.put("roles", user.getRoles().stream().map(Role::name).sorted().toList());
        payload.put("exp", expiresAt.getEpochSecond());

        String headerPart = encodeJson(header);
        String payloadPart = encodeJson(payload);
        String signature = sign(headerPart + "." + payloadPart);
        return new TokenDetails(headerPart + "." + payloadPart + "." + signature, expiresAt);
    }

    public AuthenticatedUser parseToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token");
        }

        String signedContent = parts[0] + "." + parts[1];
        if (!constantTimeEquals(sign(signedContent), parts[2])) {
            throw new IllegalArgumentException("Invalid token signature");
        }

        Map<String, Object> payload = decodeJson(parts[1]);
        Number exp = (Number) payload.get("exp");
        if (exp == null || Instant.now().getEpochSecond() >= exp.longValue()) {
            throw new IllegalArgumentException("Token has expired");
        }

        Object rolesValue = payload.get("roles");
        if (!(rolesValue instanceof List<?> roles)) {
            throw new IllegalArgumentException("Token roles are missing");
        }

        Set<Role> parsedRoles = roles.stream()
                .map(String::valueOf)
                .map(Role::valueOf)
                .collect(Collectors.toSet());
        return new AuthenticatedUser(String.valueOf(payload.get("sub")), parsedRoles);
    }

    private String encodeJson(Map<String, Object> values) {
        try {
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(values));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to create token", exception);
        }
    }

    private Map<String, Object> decodeJson(String encodedJson) {
        try {
            byte[] bytes = Base64.getUrlDecoder().decode(encodedJson);
            return objectMapper.readValue(bytes, MAP_TYPE);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid token payload", exception);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to sign token", exception);
        }
    }

    private boolean constantTimeEquals(String left, String right) {
        return MessageDigest.isEqual(left.getBytes(StandardCharsets.UTF_8), right.getBytes(StandardCharsets.UTF_8));
    }

    public record TokenDetails(String token, Instant expiresAt) {
    }

    public record AuthenticatedUser(String email, Set<Role> roles) {
    }
}
