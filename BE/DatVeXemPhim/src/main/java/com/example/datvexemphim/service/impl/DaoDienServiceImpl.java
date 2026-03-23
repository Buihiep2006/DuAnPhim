package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.DaoDienRequest;
import com.example.datvexemphim.dto.response.DaoDienResponse;
import com.example.datvexemphim.entity.DaoDien;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.DaoDienRepository;
import com.example.datvexemphim.service.DaoDienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DaoDienServiceImpl implements DaoDienService {

    @Autowired
    private DaoDienRepository daoDienRepository;

    private DaoDienResponse mapToResponse(DaoDien daoDien) {
        return DaoDienResponse.builder()
                .id(daoDien.getId())
                .ma(daoDien.getMa())
                .ten(daoDien.getTen())
                .build();
    }

    @Override
    public List<DaoDienResponse> getAll() {
        return daoDienRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DaoDienResponse getById(UUID id) {
        DaoDien daoDien = daoDienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đạo diễn với id: " + id));
        return mapToResponse(daoDien);
    }

    @Override
    public DaoDienResponse create(DaoDienRequest request) {
        DaoDien daoDien = new DaoDien();
        daoDien.setMa(request.getMa() != null && !request.getMa().isEmpty() ? request.getMa() : "DD_" + System.currentTimeMillis());
        daoDien.setTen(request.getTen());
        return mapToResponse(daoDienRepository.save(daoDien));
    }

    @Override
    public DaoDienResponse update(UUID id, DaoDienRequest request) {
        DaoDien daoDien = daoDienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đạo diễn với id: " + id));
        if (request.getMa() != null && !request.getMa().isEmpty()) {
            daoDien.setMa(request.getMa());
        }
        daoDien.setTen(request.getTen());
        return mapToResponse(daoDienRepository.save(daoDien));
    }

    @Override
    public void delete(UUID id) {
        if (!daoDienRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy đạo diễn với id: " + id);
        }
        daoDienRepository.deleteById(id);
    }
}
