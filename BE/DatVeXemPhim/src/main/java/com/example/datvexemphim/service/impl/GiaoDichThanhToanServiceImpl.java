package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.GiaoDichThanhToanRequest;
import com.example.datvexemphim.dto.response.GiaoDichThanhToanResponse;
import com.example.datvexemphim.entity.GiaoDichThanhToan;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.GiaoDichThanhToanRepository;
import com.example.datvexemphim.service.GiaoDichThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GiaoDichThanhToanServiceImpl implements GiaoDichThanhToanService {

    @Autowired
    private GiaoDichThanhToanRepository repository;

    private GiaoDichThanhToanResponse mapToResponse(GiaoDichThanhToan entity) {
        return GiaoDichThanhToanResponse.builder()
                .id(entity.getId())
                .hoaDonId(entity.getHoaDonId())
                .phuongThuc(entity.getPhuongThuc())
                .maGiaoDichBenThu3(entity.getMaGiaoDichBenThu3())
                .soTienGiaoDich(entity.getSoTienGiaoDich())
                .thoiGianGiaoDich(entity.getThoiGianGiaoDich())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<GiaoDichThanhToanResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public GiaoDichThanhToanResponse getById(UUID id) {
        GiaoDichThanhToan entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public GiaoDichThanhToanResponse create(GiaoDichThanhToanRequest request) {
        GiaoDichThanhToan entity = new GiaoDichThanhToan();
        entity.setHoaDonId(request.getHoaDonId());
        entity.setPhuongThuc(request.getPhuongThuc());
        entity.setMaGiaoDichBenThu3(request.getMaGiaoDichBenThu3());
        entity.setSoTienGiaoDich(request.getSoTienGiaoDich());
        entity.setThoiGianGiaoDich(request.getThoiGianGiaoDich());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public GiaoDichThanhToanResponse update(UUID id, GiaoDichThanhToanRequest request) {
        GiaoDichThanhToan entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setHoaDonId(request.getHoaDonId());
        entity.setPhuongThuc(request.getPhuongThuc());
        entity.setMaGiaoDichBenThu3(request.getMaGiaoDichBenThu3());
        entity.setSoTienGiaoDich(request.getSoTienGiaoDich());
        entity.setThoiGianGiaoDich(request.getThoiGianGiaoDich());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
