package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.VaiTroRequest;
import com.example.datvexemphim.dto.response.VaiTroResponse;
import com.example.datvexemphim.entity.VaiTro;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.VaiTroRepository;
import com.example.datvexemphim.service.VaiTroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VaiTroServiceImpl implements VaiTroService {

    @Autowired
    private VaiTroRepository repository;

    private VaiTroResponse mapToResponse(VaiTro entity) {
        return VaiTroResponse.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .build();
    }

    @Override
    public List<VaiTroResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public VaiTroResponse getById(UUID id) {
        VaiTro entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public VaiTroResponse create(VaiTroRequest request) {
        VaiTro entity = new VaiTro();
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public VaiTroResponse update(UUID id, VaiTroRequest request) {
        VaiTro entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
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
