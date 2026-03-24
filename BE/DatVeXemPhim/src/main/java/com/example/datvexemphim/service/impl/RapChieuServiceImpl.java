package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.RapChieuRequest;
import com.example.datvexemphim.dto.response.RapChieuResponse;
import com.example.datvexemphim.entity.RapChieu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.RapChieuRepository;
import com.example.datvexemphim.service.RapChieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RapChieuServiceImpl implements RapChieuService {

    @Autowired
    private RapChieuRepository repository;

    private RapChieuResponse mapToResponse(RapChieu entity) {
        return RapChieuResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .diaChi(entity.getDiaChi())
                .khuVuc(entity.getKhuVuc())
                .moTa(entity.getMoTa())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<RapChieuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public RapChieuResponse getById(UUID id) {
        RapChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public RapChieuResponse create(RapChieuRequest request) {
        RapChieu entity = new RapChieu();
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setDiaChi(request.getDiaChi());
        entity.setKhuVuc(request.getKhuVuc());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public RapChieuResponse update(UUID id, RapChieuRequest request) {
        RapChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setDiaChi(request.getDiaChi());
        entity.setKhuVuc(request.getKhuVuc());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        RapChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setTrangThai(3);
        repository.save(entity);
    }
}
