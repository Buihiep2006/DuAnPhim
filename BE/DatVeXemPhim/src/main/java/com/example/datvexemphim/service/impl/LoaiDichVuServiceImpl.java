package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.LoaiDichVuRequest;
import com.example.datvexemphim.dto.response.LoaiDichVuResponse;
import com.example.datvexemphim.entity.LoaiDichVu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.LoaiDichVuRepository;
import com.example.datvexemphim.service.LoaiDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LoaiDichVuServiceImpl implements LoaiDichVuService {

    @Autowired
    private LoaiDichVuRepository repository;

    private LoaiDichVuResponse mapToResponse(LoaiDichVu entity) {
        return LoaiDichVuResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .build();
    }

    @Override
    public List<LoaiDichVuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public LoaiDichVuResponse getById(UUID id) {
        LoaiDichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public LoaiDichVuResponse create(LoaiDichVuRequest request) {
        LoaiDichVu entity = new LoaiDichVu();
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public LoaiDichVuResponse update(UUID id, LoaiDichVuRequest request) {
        LoaiDichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
