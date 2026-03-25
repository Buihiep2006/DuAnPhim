package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.KhachHangRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.AuthResponse;
import com.example.datvexemphim.dto.response.KhachHangResponse;
import com.example.datvexemphim.security.AuthTokenService;
import com.example.datvexemphim.service.KhachHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/khach-hang")
@CrossOrigin("*")
public class KhachHangController {

    @Autowired
    private KhachHangService service;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<KhachHangResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lay danh sach thanh cong"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHangResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lay thong tin thanh cong"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KhachHangResponse>> create(@Valid @RequestBody KhachHangRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Them moi thanh cong"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHangResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody KhachHangRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cap nhat thanh cong"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xoa thanh cong"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse<KhachHangResponse>>> login(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String matKhau = request.get("matKhau");
        KhachHangResponse user = service.login(email, matKhau);
        AuthResponse<KhachHangResponse> response = AuthResponse.<KhachHangResponse>builder()
                .token(authTokenService.generateToken(user.getId(), "CUSTOMER"))
                .user(user)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Dang nhap thanh cong"));
    }
}
