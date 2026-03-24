package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.KhuyenMaiRequest;
import com.example.datvexemphim.dto.response.KhuyenMaiResponse;
import com.example.datvexemphim.entity.KhuyenMai;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.KhuyenMaiRepository;
import com.example.datvexemphim.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KhuyenMaiServiceImpl implements KhuyenMaiService {

    @Autowired
    private KhuyenMaiRepository repository;

    private KhuyenMaiResponse mapToResponse(KhuyenMai entity) {
        return KhuyenMaiResponse.builder()
                .id(entity.getId())
                .maCode(entity.getMaCode())
                .ten(entity.getTen())
                .phanTramGiam(entity.getPhanTramGiam())
                .giamToiDa(entity.getGiamToiDa())
                .soLuong(entity.getSoLuong())
                .thoiGianBatDau(entity.getThoiGianBatDau())
                .thoiGianKetThuc(entity.getThoiGianKetThuc())
                .moTa(entity.getMoTa())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<KhuyenMaiResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public KhuyenMaiResponse getById(UUID id) {
        KhuyenMai entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public KhuyenMaiResponse create(KhuyenMaiRequest request) {
        KhuyenMai entity = new KhuyenMai();
        entity.setMaCode(request.getMaCode());
        entity.setTen(request.getTen());
        entity.setPhanTramGiam(request.getPhanTramGiam());
        entity.setGiamToiDa(request.getGiamToiDa());
        entity.setSoLuong(request.getSoLuong());
        entity.setThoiGianBatDau(request.getThoiGianBatDau());
        entity.setThoiGianKetThuc(request.getThoiGianKetThuc());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public KhuyenMaiResponse update(UUID id, KhuyenMaiRequest request) {
        KhuyenMai entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setMaCode(request.getMaCode());
        entity.setTen(request.getTen());
        entity.setPhanTramGiam(request.getPhanTramGiam());
        entity.setGiamToiDa(request.getGiamToiDa());
        entity.setSoLuong(request.getSoLuong());
        entity.setThoiGianBatDau(request.getThoiGianBatDau());
        entity.setThoiGianKetThuc(request.getThoiGianKetThuc());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        KhuyenMai entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setTrangThai(3);
        repository.save(entity);
    }
}
