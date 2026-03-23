package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.DienVienRequest;
import com.example.datvexemphim.dto.response.DienVienResponse;
import com.example.datvexemphim.entity.DienVien;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.DienVienRepository;
import com.example.datvexemphim.service.DienVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DienVienServiceImpl implements DienVienService {

    @Autowired
    private DienVienRepository dienVienRepository;

    private DienVienResponse mapToResponse(DienVien dienVien) {
        return DienVienResponse.builder()
                .id(dienVien.getId())
                .ma(dienVien.getMa())
                .ten(dienVien.getTen())
                .build();
    }

    @Override
    public List<DienVienResponse> getAll() {
        return dienVienRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DienVienResponse getById(UUID id) {
        DienVien dienVien = dienVienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy diễn viên với id: " + id));
        return mapToResponse(dienVien);
    }

    @Override
    public DienVienResponse create(DienVienRequest request) {
        DienVien dienVien = new DienVien();
        dienVien.setMa(request.getMa() != null && !request.getMa().isEmpty() ? request.getMa() : "DV_" + System.currentTimeMillis());
        dienVien.setTen(request.getTen());
        return mapToResponse(dienVienRepository.save(dienVien));
    }

    @Override
    public DienVienResponse update(UUID id, DienVienRequest request) {
        DienVien dienVien = dienVienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy diễn viên với id: " + id));
        if (request.getMa() != null && !request.getMa().isEmpty()) {
            dienVien.setMa(request.getMa());
        }
        dienVien.setTen(request.getTen());
        return mapToResponse(dienVienRepository.save(dienVien));
    }

    @Override
    public void delete(UUID id) {
        if (!dienVienRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy diễn viên với id: " + id);
        }
        dienVienRepository.deleteById(id);
    }
}
