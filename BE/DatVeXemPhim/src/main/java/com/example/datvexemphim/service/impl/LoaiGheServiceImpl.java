package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.LoaiGheRequest;
import com.example.datvexemphim.dto.response.LoaiGheResponse;
import com.example.datvexemphim.entity.LoaiGhe;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.LoaiGheRepository;
import com.example.datvexemphim.service.LoaiGheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LoaiGheServiceImpl implements LoaiGheService {

    @Autowired
    private LoaiGheRepository repository;

    private LoaiGheResponse mapToResponse(LoaiGhe entity) {
        return LoaiGheResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .phuThu(entity.getPhuThu())
                .build();
    }

    @Override
    public List<LoaiGheResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public LoaiGheResponse getById(UUID id) {
        LoaiGhe entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public LoaiGheResponse create(LoaiGheRequest request) {
        LoaiGhe entity = new LoaiGhe();
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setPhuThu(request.getPhuThu());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public LoaiGheResponse update(UUID id, LoaiGheRequest request) {
        LoaiGhe entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setPhuThu(request.getPhuThu());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
