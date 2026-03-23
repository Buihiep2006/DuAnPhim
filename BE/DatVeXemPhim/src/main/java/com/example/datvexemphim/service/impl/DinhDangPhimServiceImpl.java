package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.DinhDangPhimRequest;
import com.example.datvexemphim.dto.response.DinhDangPhimResponse;
import com.example.datvexemphim.entity.DinhDangPhim;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.DinhDangPhimRepository;
import com.example.datvexemphim.service.DinhDangPhimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DinhDangPhimServiceImpl implements DinhDangPhimService {

    @Autowired
    private DinhDangPhimRepository repository;

    private DinhDangPhimResponse mapToResponse(DinhDangPhim entity) {
        return DinhDangPhimResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .phuThu(entity.getPhuThu())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<DinhDangPhimResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public DinhDangPhimResponse getById(UUID id) {
        DinhDangPhim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public DinhDangPhimResponse create(DinhDangPhimRequest request) {
        DinhDangPhim entity = new DinhDangPhim();
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setPhuThu(request.getPhuThu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public DinhDangPhimResponse update(UUID id, DinhDangPhimRequest request) {
        DinhDangPhim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setPhuThu(request.getPhuThu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
