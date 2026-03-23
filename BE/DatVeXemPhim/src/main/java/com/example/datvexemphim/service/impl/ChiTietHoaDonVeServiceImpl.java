package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.ChiTietHoaDonVeRequest;
import com.example.datvexemphim.dto.response.ChiTietHoaDonVeResponse;
import com.example.datvexemphim.entity.ChiTietHoaDonVe;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.ChiTietHoaDonVeRepository;
import com.example.datvexemphim.service.ChiTietHoaDonVeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChiTietHoaDonVeServiceImpl implements ChiTietHoaDonVeService {

    @Autowired
    private ChiTietHoaDonVeRepository repository;

    private ChiTietHoaDonVeResponse mapToResponse(ChiTietHoaDonVe entity) {
        return ChiTietHoaDonVeResponse.builder()
                .id(entity.getId())
                .hoaDonId(entity.getHoaDonId())
                .veBanId(entity.getVeBanId())
                .thanhTien(entity.getThanhTien())
                .build();
    }

    @Override
    public List<ChiTietHoaDonVeResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ChiTietHoaDonVeResponse getById(UUID id) {
        ChiTietHoaDonVe entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public ChiTietHoaDonVeResponse create(ChiTietHoaDonVeRequest request) {
        ChiTietHoaDonVe entity = new ChiTietHoaDonVe();
        entity.setHoaDonId(request.getHoaDonId());
        entity.setVeBanId(request.getVeBanId());
        entity.setThanhTien(request.getThanhTien());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public ChiTietHoaDonVeResponse update(UUID id, ChiTietHoaDonVeRequest request) {
        ChiTietHoaDonVe entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setHoaDonId(request.getHoaDonId());
        entity.setVeBanId(request.getVeBanId());
        entity.setThanhTien(request.getThanhTien());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
