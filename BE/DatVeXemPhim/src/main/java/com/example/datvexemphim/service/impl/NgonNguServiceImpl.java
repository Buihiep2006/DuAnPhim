package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.NgonNguRequest;
import com.example.datvexemphim.dto.response.NgonNguResponse;
import com.example.datvexemphim.entity.NgonNgu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.NgonNguRepository;
import com.example.datvexemphim.service.NgonNguService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NgonNguServiceImpl implements NgonNguService {

    @Autowired
    private NgonNguRepository ngonNguRepository;

    private NgonNguResponse mapToResponse(NgonNgu ngonNgu) {
        return NgonNguResponse.builder()
                .id(ngonNgu.getId())
                .ma(ngonNgu.getMa())
                .ten(ngonNgu.getTen())
                .build();
    }

    @Override
    public List<NgonNguResponse> getAll() {
        return ngonNguRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NgonNguResponse getById(UUID id) {
        NgonNgu ngonNgu = ngonNguRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngôn ngữ với id: " + id));
        return mapToResponse(ngonNgu);
    }

    @Override
    public NgonNguResponse create(NgonNguRequest request) {
        NgonNgu ngonNgu = new NgonNgu();
        ngonNgu.setMa(request.getMa() != null && !request.getMa().isEmpty() ? request.getMa() : "NN_" + System.currentTimeMillis());
        ngonNgu.setTen(request.getTen());
        return mapToResponse(ngonNguRepository.save(ngonNgu));
    }

    @Override
    public NgonNguResponse update(UUID id, NgonNguRequest request) {
        NgonNgu ngonNgu = ngonNguRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngôn ngữ với id: " + id));
        if (request.getMa() != null && !request.getMa().isEmpty()) {
            ngonNgu.setMa(request.getMa());
        }
        ngonNgu.setTen(request.getTen());
        return mapToResponse(ngonNguRepository.save(ngonNgu));
    }

    @Override
    public void delete(UUID id) {
        if (!ngonNguRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy ngôn ngữ với id: " + id);
        }
        ngonNguRepository.deleteById(id);
    }
}
