package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.KhachHangRequest;
import com.example.datvexemphim.dto.response.KhachHangResponse;
import com.example.datvexemphim.entity.KhachHang;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.KhachHangRepository;
import com.example.datvexemphim.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private KhachHangRepository repository;

    private KhachHangResponse mapToResponse(KhachHang entity) {
        return KhachHangResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .hoTen(entity.getHoTen())
                .email(entity.getEmail())
                .matKhau(entity.getMatKhau())
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
        KhachHang entity = new KhachHang();
        entity.setMa(request.getMa());
        entity.setHoTen(request.getHoTen());
        entity.setEmail(request.getEmail());
        entity.setMatKhau(request.getMatKhau());
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(request.getSoDienThoai());
        entity.setAuthProvider(request.getAuthProvider());
        entity.setProviderId(request.getProviderId());
        entity.setHinhAnhDaiDien(request.getHinhAnhDaiDien());
        entity.setDiemTichLuy(request.getDiemTichLuy());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public KhachHangResponse update(UUID id, KhachHangRequest request) {
        KhachHang entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setHoTen(request.getHoTen());
        entity.setEmail(request.getEmail());
        entity.setMatKhau(request.getMatKhau());
        entity.setNgaySinh(request.getNgaySinh());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setSoDienThoai(request.getSoDienThoai());
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
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
