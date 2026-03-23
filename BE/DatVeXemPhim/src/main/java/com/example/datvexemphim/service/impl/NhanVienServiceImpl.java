package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.NhanVienRequest;
import com.example.datvexemphim.dto.response.NhanVienResponse;
import com.example.datvexemphim.entity.NhanVien;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.NhanVienRepository;
import com.example.datvexemphim.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NhanVienServiceImpl implements NhanVienService {

    @Autowired
    private NhanVienRepository repository;

    private NhanVienResponse mapToResponse(NhanVien entity) {
        return NhanVienResponse.builder()
                .id(entity.getId())
                .vaiTroId(entity.getVaiTroId())
                .ma(entity.getMa())
                .hoTen(entity.getHoTen())
                .email(entity.getEmail())
                .matKhau(entity.getMatKhau())
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
        entity.setMatKhau(request.getMatKhau());
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
        entity.setMatKhau(request.getMatKhau());
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
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
