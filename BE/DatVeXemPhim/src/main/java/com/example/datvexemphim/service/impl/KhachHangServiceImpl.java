package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.KhachHangRequest;
import com.example.datvexemphim.dto.response.KhachHangResponse;
import com.example.datvexemphim.entity.KhachHang;
import com.example.datvexemphim.exception.BadRequestException;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.KhachHangRepository;
import com.example.datvexemphim.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private KhachHangRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private KhachHangResponse mapToResponse(KhachHang entity) {
        return KhachHangResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .hoTen(entity.getHoTen())
                .email(entity.getEmail())
                .ngaySinh(entity.getNgaySinh())
                .gioiTinh(entity.getGioiTinh())
                .soDienThoai(entity.getSoDienThoai())
                .authProvider(entity.getAuthProvider())
                .providerId(entity.getProviderId())
                .hinhAnhDaiDien(entity.getHinhAnhDaiDien())
                .diemTichLuy(entity.getDiemTichLuy())
                .trangThai(entity.getTrangThai())
                .ngayTao(entity.getNgayTao())
                .build();
    }

    @Override
    public List<KhachHangResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public KhachHangResponse getById(UUID id) {
        KhachHang entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public KhachHangResponse create(KhachHangRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        String normalizedPhone = normalizePhone(request.getSoDienThoai());
        validateUniqueForCreate(normalizedEmail, normalizedPhone);

        KhachHang entity = new KhachHang();

        if (!hasText(request.getMa())) {
            entity.setMa("KH_" + System.currentTimeMillis() % 1000000);
        } else {
            entity.setMa(request.getMa());
        }

        entity.setHoTen(request.getHoTen());
        entity.setEmail(normalizedEmail);
        entity.setMatKhau(hashPassword(request.getMatKhau()));
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(normalizedPhone);
        entity.setAuthProvider(request.getAuthProvider() != null ? request.getAuthProvider() : "LOCAL");
        entity.setProviderId(request.getProviderId());
        entity.setHinhAnhDaiDien(request.getHinhAnhDaiDien());
        entity.setDiemTichLuy(request.getDiemTichLuy() != null ? request.getDiemTichLuy() : 0);
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : 1);
        entity.setNgayTao(request.getNgayTao() != null ? request.getNgayTao() : LocalDateTime.now());

        return mapToResponse(repository.save(entity));
    }

    @Override
    public KhachHangResponse update(UUID id, KhachHangRequest request) {
        KhachHang entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        String normalizedEmail = normalizeEmail(request.getEmail());
        String normalizedPhone = normalizePhone(request.getSoDienThoai());

        validateUniqueForUpdate(id, normalizedEmail, normalizedPhone);

        entity.setMa(request.getMa());
        entity.setHoTen(request.getHoTen());
        entity.setEmail(normalizedEmail);
        if (hasText(request.getMatKhau())) {
            entity.setMatKhau(hashPassword(request.getMatKhau()));
        }
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(normalizedPhone);
        entity.setAuthProvider(request.getAuthProvider());
        entity.setProviderId(request.getProviderId());
        entity.setHinhAnhDaiDien(request.getHinhAnhDaiDien());
        entity.setDiemTichLuy(request.getDiemTichLuy());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Not found: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public KhachHangResponse login(String email, String matKhau) {
        KhachHang khachHang = repository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new ResourceNotFoundException("Email khong ton tai"));

        if (!passwordMatches(khachHang.getMatKhau(), matKhau)) {
            throw new RuntimeException("Mat khau khong dung");
        }

        upgradeLegacyPasswordIfNeeded(khachHang, matKhau);
        return mapToResponse(khachHang);
    }

    @Override
    public KhachHangResponse loginWithGoogle(String email, String hoTen, String providerId, String hinhAnhDaiDien) {
        String normalizedEmail = normalizeEmail(email);

        if (!hasText(normalizedEmail) || !hasText(providerId)) {
            throw new RuntimeException("Thong tin tai khoan Google khong hop le");
        }

        KhachHang khachHang = repository.findByAuthProviderAndProviderId("GOOGLE", providerId)
                .or(() -> repository.findByEmail(normalizedEmail))
                .orElseGet(KhachHang::new);

        if (khachHang.getId() == null && !hasText(khachHang.getMa())) {
            khachHang.setMa("KH_" + System.currentTimeMillis() % 1000000);
            khachHang.setNgayTao(LocalDateTime.now());
            khachHang.setDiemTichLuy(0);
            khachHang.setTrangThai(1);
        }

        khachHang.setEmail(normalizedEmail);
        khachHang.setHoTen(hasText(hoTen) ? hoTen.trim() : normalizedEmail);
        khachHang.setAuthProvider("GOOGLE");
        khachHang.setProviderId(providerId);
        if (hasText(hinhAnhDaiDien)) {
            khachHang.setHinhAnhDaiDien(hinhAnhDaiDien);
        }
        if (!hasText(khachHang.getMatKhau())) {
            khachHang.setMatKhau(passwordEncoder.encode(providerId + ":google"));
        }

        return mapToResponse(repository.save(khachHang));
    }

    private void validateUniqueForCreate(String email, String soDienThoai) {
        if (repository.existsByEmail(email)) {
            throw new BadRequestException("Email da duoc su dung");
        }

        if (hasText(soDienThoai) && repository.existsBySoDienThoai(soDienThoai)) {
            throw new BadRequestException("So dien thoai da duoc su dung");
        }
    }

    private void validateUniqueForUpdate(UUID id, String email, String soDienThoai) {
        if (repository.existsByEmailAndIdNot(email, id)) {
            throw new BadRequestException("Email da duoc su dung");
        }

        if (hasText(soDienThoai) && repository.existsBySoDienThoaiAndIdNot(soDienThoai, id)) {
            throw new BadRequestException("So dien thoai da duoc su dung");
        }
    }

    private String hashPassword(String rawPassword) {
        if (!hasText(rawPassword) || isPasswordHash(rawPassword)) {
            return rawPassword;
        }
        return passwordEncoder.encode(rawPassword);
    }

    private boolean passwordMatches(String storedPassword, String rawPassword) {
        if (!hasText(storedPassword) || !hasText(rawPassword)) {
            return false;
        }
        if (isPasswordHash(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return storedPassword.equals(rawPassword);
    }

    private void upgradeLegacyPasswordIfNeeded(KhachHang khachHang, String rawPassword) {
        if (!hasText(khachHang.getMatKhau()) || isPasswordHash(khachHang.getMatKhau())) {
            return;
        }
        if (khachHang.getMatKhau().equals(rawPassword)) {
            khachHang.setMatKhau(passwordEncoder.encode(rawPassword));
            repository.save(khachHang);
        }
    }

    private boolean isPasswordHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }

    private String normalizeEmail(String email) {
        if (!hasText(email)) {
            throw new BadRequestException("Email khong duoc de trong");
        }
        return email.trim().toLowerCase();
    }

    private String normalizePhone(String phone) {
        if (!hasText(phone)) {
            return null;
        }

        String normalized = phone.trim().replaceAll("\\s+", "");
        return normalized.isEmpty() ? null : normalized;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
