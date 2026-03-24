package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.PhongChieuRequest;
import com.example.datvexemphim.dto.response.PhongChieuResponse;
import com.example.datvexemphim.entity.PhongChieu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.PhongChieuRepository;
import com.example.datvexemphim.service.PhongChieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PhongChieuServiceImpl implements PhongChieuService {

    @Autowired
    private PhongChieuRepository repository;

    private PhongChieuResponse mapToResponse(PhongChieu entity) {
        return PhongChieuResponse.builder()
                .id(entity.getId())
                .rapChieuId(entity.getRapChieuId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .sucChua(entity.getSucChua())
                .loaiMayChieu(entity.getLoaiMayChieu())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<PhongChieuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PhongChieuResponse getById(UUID id) {
        PhongChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public PhongChieuResponse create(PhongChieuRequest request) {
        PhongChieu entity = new PhongChieu();
        entity.setRapChieuId(request.getRapChieuId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setSucChua(request.getSucChua());
        entity.setLoaiMayChieu(request.getLoaiMayChieu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public PhongChieuResponse update(UUID id, PhongChieuRequest request) {
        PhongChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setRapChieuId(request.getRapChieuId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setSucChua(request.getSucChua());
        entity.setLoaiMayChieu(request.getLoaiMayChieu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        PhongChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setTrangThai(3);
        repository.save(entity);
    }
}
