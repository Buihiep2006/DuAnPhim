package com.example.datvexemphim.security;

import com.example.datvexemphim.dto.response.KhachHangResponse;
import com.example.datvexemphim.service.KhachHangService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final KhachHangService khachHangService;
    private final AuthTokenService authTokenService;

    @Value("${frontend.url:http://localhost:6789}")
    private String frontendUrl;

    public GoogleOAuth2SuccessHandler(KhachHangService khachHangService, AuthTokenService authTokenService) {
        this.khachHangService = khachHangService;
        this.authTokenService = authTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        String providerId = oauth2User.getAttribute("sub");

        KhachHangResponse user = khachHangService.loginWithGoogle(email, name, providerId, picture);
        String token = authTokenService.generateToken(user.getId(), "CUSTOMER");

        String userPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(toJsonMap(user).getBytes(StandardCharsets.UTF_8));

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/auth/google/callback")
                .queryParam("token", token)
                .queryParam("user", userPayload)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private String toJsonMap(KhachHangResponse user) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", user.getId());
        payload.put("ma", defaultString(user.getMa()));
        payload.put("hoTen", defaultString(user.getHoTen()));
        payload.put("email", defaultString(user.getEmail()));
        payload.put("ngaySinh", user.getNgaySinh() == null ? "" : user.getNgaySinh().toString());
        payload.put("gioiTinh", user.getGioiTinh() == null ? "" : user.getGioiTinh());
        payload.put("soDienThoai", defaultString(user.getSoDienThoai()));
        payload.put("hinhAnhDaiDien", defaultString(user.getHinhAnhDaiDien()));
        payload.put("diemTichLuy", user.getDiemTichLuy() == null ? 0 : user.getDiemTichLuy());
        payload.put("providerId", defaultString(user.getProviderId()));
        payload.put("trangThai", user.getTrangThai() == null ? 1 : user.getTrangThai());
        payload.put("ngayTao", user.getNgayTao() == null ? "" : user.getNgayTao().toString());

        StringBuilder builder = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (!first) {
                builder.append(",");
            }
            first = false;
            builder.append("\"").append(entry.getKey()).append("\":");
            Object value = entry.getValue();
            if (value instanceof Number) {
                builder.append(value);
            } else {
                builder.append("\"")
                        .append(String.valueOf(value).replace("\\", "\\\\").replace("\"", "\\\""))
                        .append("\"");
            }
        }
        builder.append("}");
        return builder.toString();
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }
}
