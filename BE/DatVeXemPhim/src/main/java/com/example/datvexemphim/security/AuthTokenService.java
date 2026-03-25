package com.example.datvexemphim.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthTokenService {

    private static final Duration TOKEN_TTL = Duration.ofHours(24);
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    @Value("${auth.token.secret:}")
    private String configuredSecret;

    private byte[] secretKey;

    @PostConstruct
    void init() {
        if (configuredSecret != null && !configuredSecret.trim().isEmpty()) {
            secretKey = configuredSecret.getBytes(StandardCharsets.UTF_8);
            return;
        }

        byte[] generatedSecret = new byte[32];
        new SecureRandom().nextBytes(generatedSecret);
        secretKey = generatedSecret;
    }

    public String generateToken(UUID userId, String accessScope) {
        long expiresAt = Instant.now().plus(TOKEN_TTL).getEpochSecond();
        String payload = userId + ":" + accessScope + ":" + expiresAt;
        String signature = sign(payload);
        return URL_ENCODER.encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + "." + signature;
    }

    public Optional<AuthenticatedUser> parseToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 2) {
                return Optional.empty();
            }

            String payload = new String(URL_DECODER.decode(parts[0]), StandardCharsets.UTF_8);
            if (!sign(payload).equals(parts[1])) {
                return Optional.empty();
            }

            String[] payloadParts = payload.split(":");
            if (payloadParts.length != 3) {
                return Optional.empty();
            }

            long expiresAt = Long.parseLong(payloadParts[2]);
            if (Instant.now().getEpochSecond() > expiresAt) {
                return Optional.empty();
            }

            return Optional.of(new AuthenticatedUser(UUID.fromString(payloadParts[0]), payloadParts[1]));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
            return URL_ENCODER.encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot sign auth token", ex);
        }
    }
}
