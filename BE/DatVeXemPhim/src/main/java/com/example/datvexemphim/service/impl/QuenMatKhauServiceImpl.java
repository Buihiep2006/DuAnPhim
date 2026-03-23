package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.QuenMatKhauRequest;
import com.example.datvexemphim.dto.response.QuenMatKhauResponse;
import com.example.datvexemphim.entity.QuenMatKhau;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.QuenMatKhauRepository;
import com.example.datvexemphim.service.QuenMatKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuenMatKhauServiceImpl implements QuenMatKhauService {

    @Autowired
    private QuenMatKhauRepository repository;

    private QuenMatKhauResponse mapToResponse(QuenMatKhau entity) {
        return QuenMatKhauResponse.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .maToken(entity.getMaToken())
                .thoiGianHetHan(entity.getThoiGianHetHan())
                .build();
    }

    @Override
    public List<QuenMatKhauResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public QuenMatKhauResponse getById(UUID id) {
        QuenMatKhau entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public QuenMatKhauResponse create(QuenMatKhauRequest request) {
        QuenMatKhau entity = new QuenMatKhau();
        entity.setEmail(request.getEmail());
        entity.setMaToken(request.getMaToken());
        entity.setThoiGianHetHan(request.getThoiGianHetHan());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public QuenMatKhauResponse update(UUID id, QuenMatKhauRequest request) {
        QuenMatKhau entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setEmail(request.getEmail());
        entity.setMaToken(request.getMaToken());
        entity.setThoiGianHetHan(request.getThoiGianHetHan());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
