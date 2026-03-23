package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.ChiTietHoaDonDichVuRequest;
import com.example.datvexemphim.dto.response.ChiTietHoaDonDichVuResponse;
import com.example.datvexemphim.entity.ChiTietHoaDonDichVu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.ChiTietHoaDonDichVuRepository;
import com.example.datvexemphim.service.ChiTietHoaDonDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChiTietHoaDonDichVuServiceImpl implements ChiTietHoaDonDichVuService {

    @Autowired
    private ChiTietHoaDonDichVuRepository repository;

    private ChiTietHoaDonDichVuResponse mapToResponse(ChiTietHoaDonDichVu entity) {
        return ChiTietHoaDonDichVuResponse.builder()
                .id(entity.getId())
                .hoaDonId(entity.getHoaDonId())
                .dichVuId(entity.getDichVuId())
                .soLuong(entity.getSoLuong())
                .donGia(entity.getDonGia())
                .thanhTien(entity.getThanhTien())
                .build();
    }

    @Override
    public List<ChiTietHoaDonDichVuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ChiTietHoaDonDichVuResponse getById(UUID id) {
        ChiTietHoaDonDichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public ChiTietHoaDonDichVuResponse create(ChiTietHoaDonDichVuRequest request) {
        ChiTietHoaDonDichVu entity = new ChiTietHoaDonDichVu();
        entity.setHoaDonId(request.getHoaDonId());
        entity.setDichVuId(request.getDichVuId());
        entity.setSoLuong(request.getSoLuong());
        entity.setDonGia(request.getDonGia());
        entity.setThanhTien(request.getThanhTien());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public ChiTietHoaDonDichVuResponse update(UUID id, ChiTietHoaDonDichVuRequest request) {
        ChiTietHoaDonDichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setHoaDonId(request.getHoaDonId());
        entity.setDichVuId(request.getDichVuId());
        entity.setSoLuong(request.getSoLuong());
        entity.setDonGia(request.getDonGia());
        entity.setThanhTien(request.getThanhTien());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
