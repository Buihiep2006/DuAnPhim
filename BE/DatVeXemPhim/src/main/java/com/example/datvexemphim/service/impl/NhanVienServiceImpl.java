package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.NhanVienRequest;
import com.example.datvexemphim.dto.response.NhanVienResponse;
import com.example.datvexemphim.entity.NhanVien;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.NhanVienRepository;
import com.example.datvexemphim.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NhanVienServiceImpl implements NhanVienService {

    @Autowired
    private NhanVienRepository repository;

    @Autowired
    private com.example.datvexemphim.repository.VaiTroRepository vaiTroRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private NhanVienResponse mapToResponse(NhanVien entity) {
        String vaiTroMa = "";
        if (entity.getVaiTroId() != null) {
            vaiTroMa = vaiTroRepository.findById(entity.getVaiTroId())
                    .map(v -> v.getMa())
                    .orElse("");
        }

        return NhanVienResponse.builder()
                .id(entity.getId())
                .vaiTroId(entity.getVaiTroId())
                .vaiTroMa(vaiTroMa)
                .ma(entity.getMa())
                .hoTen(entity.getHoTen())
                .email(entity.getEmail())
                .ngaySinh(entity.getNgaySinh())
                .gioiTinh(entity.getGioiTinh())
                .soDienThoai(entity.getSoDienThoai())
                .hinhAnhDaiDien(entity.getHinhAnhDaiDien())
                .trangThai(entity.getTrangThai())
                .ngayTao(entity.getNgayTao())
                .build();
    }

    @Override
    public List<NhanVienResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public NhanVienResponse getById(UUID id) {
        NhanVien entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public NhanVienResponse create(NhanVienRequest request) {
        NhanVien entity = new NhanVien();
        entity.setVaiTroId(request.getVaiTroId());
        entity.setMa(request.getMa());
        entity.setHoTen(request.getHoTen());
        entity.setEmail(request.getEmail());
        entity.setMatKhau(hashPassword(request.getMatKhau()));
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(request.getSoDienThoai());
        entity.setHinhAnhDaiDien(request.getHinhAnhDaiDien());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public NhanVienResponse update(UUID id, NhanVienRequest request) {
        NhanVien entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setVaiTroId(request.getVaiTroId());
        entity.setMa(request.getMa());
        entity.setHoTen(request.getHoTen());
        entity.setEmail(request.getEmail());
        if (hasText(request.getMatKhau())) {
            entity.setMatKhau(hashPassword(request.getMatKhau()));
        }
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(request.getSoDienThoai());
        entity.setHinhAnhDaiDien(request.getHinhAnhDaiDien());
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
    public NhanVienResponse login(String email, String matKhau) {
        NhanVien nhanVien = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email khong ton tai"));

        if (!passwordMatches(nhanVien.getMatKhau(), matKhau)) {
            throw new RuntimeException("Mat khau khong dung");
        }

        upgradeLegacyPasswordIfNeeded(nhanVien, matKhau);
        return mapToResponse(nhanVien);
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

    private void upgradeLegacyPasswordIfNeeded(NhanVien nhanVien, String rawPassword) {
        if (!hasText(nhanVien.getMatKhau()) || isPasswordHash(nhanVien.getMatKhau())) {
            return;
        }
        if (nhanVien.getMatKhau().equals(rawPassword)) {
            nhanVien.setMatKhau(passwordEncoder.encode(rawPassword));
            repository.save(nhanVien);
        }
    }

    private boolean isPasswordHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
