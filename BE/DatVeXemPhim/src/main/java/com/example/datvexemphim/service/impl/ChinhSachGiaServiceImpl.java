package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.ChinhSachGiaRequest;
import com.example.datvexemphim.dto.response.ChinhSachGiaResponse;
import com.example.datvexemphim.entity.ChinhSachGia;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.ChinhSachGiaRepository;
import com.example.datvexemphim.service.ChinhSachGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChinhSachGiaServiceImpl implements ChinhSachGiaService {

    @Autowired
    private ChinhSachGiaRepository repository;

    private ChinhSachGiaResponse mapToResponse(ChinhSachGia entity) {
        return ChinhSachGiaResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .tenChinhSach(entity.getTenChinhSach())
                .ngayTrongTuan(entity.getNgayTrongTuan())
                .khungGioBatDau(entity.getKhungGioBatDau())
                .khungGioKetThuc(entity.getKhungGioKetThuc())
                .phanTramDieuChinh(entity.getPhanTramDieuChinh())
                .phuThuCoDinh(entity.getPhuThuCoDinh())
                .uuTien(entity.getUuTien())
                .trangThai(entity.getTrangThai())
                .ngayTao(entity.getNgayTao())
                .build();
    }

    @Override
    public List<ChinhSachGiaResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ChinhSachGiaResponse getById(UUID id) {
        ChinhSachGia entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public ChinhSachGiaResponse create(ChinhSachGiaRequest request) {
        ChinhSachGia entity = new ChinhSachGia();
        entity.setMa(request.getMa());
        entity.setTenChinhSach(request.getTenChinhSach());
        entity.setNgayTrongTuan(request.getNgayTrongTuan());
        entity.setKhungGioBatDau(request.getKhungGioBatDau());
        entity.setKhungGioKetThuc(request.getKhungGioKetThuc());
        entity.setPhanTramDieuChinh(request.getPhanTramDieuChinh());
        entity.setPhuThuCoDinh(request.getPhuThuCoDinh());
        entity.setUuTien(request.getUuTien());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public ChinhSachGiaResponse update(UUID id, ChinhSachGiaRequest request) {
        ChinhSachGia entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setTenChinhSach(request.getTenChinhSach());
        entity.setNgayTrongTuan(request.getNgayTrongTuan());
        entity.setKhungGioBatDau(request.getKhungGioBatDau());
        entity.setKhungGioKetThuc(request.getKhungGioKetThuc());
        entity.setPhanTramDieuChinh(request.getPhanTramDieuChinh());
        entity.setPhuThuCoDinh(request.getPhuThuCoDinh());
        entity.setUuTien(request.getUuTien());
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
