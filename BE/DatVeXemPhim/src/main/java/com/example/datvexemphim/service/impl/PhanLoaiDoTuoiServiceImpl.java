package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.PhanLoaiDoTuoiRequest;
import com.example.datvexemphim.dto.response.PhanLoaiDoTuoiResponse;
import com.example.datvexemphim.entity.PhanLoaiDoTuoi;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.PhanLoaiDoTuoiRepository;
import com.example.datvexemphim.service.PhanLoaiDoTuoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PhanLoaiDoTuoiServiceImpl implements PhanLoaiDoTuoiService {

    @Autowired
    private PhanLoaiDoTuoiRepository repository;

    private PhanLoaiDoTuoiResponse mapToResponse(PhanLoaiDoTuoi entity) {
        return PhanLoaiDoTuoiResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .moTa(entity.getMoTa())
                .build();
    }

    @Override
    public List<PhanLoaiDoTuoiResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PhanLoaiDoTuoiResponse getById(UUID id) {
        PhanLoaiDoTuoi entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public PhanLoaiDoTuoiResponse create(PhanLoaiDoTuoiRequest request) {
        PhanLoaiDoTuoi entity = new PhanLoaiDoTuoi();
        entity.setMa(request.getMa());
        entity.setMoTa(request.getMoTa());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public PhanLoaiDoTuoiResponse update(UUID id, PhanLoaiDoTuoiRequest request) {
        PhanLoaiDoTuoi entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMa(request.getMa());
        entity.setMoTa(request.getMoTa());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
