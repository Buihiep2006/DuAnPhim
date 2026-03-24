package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.DichVuRequest;
import com.example.datvexemphim.dto.response.DichVuResponse;
import com.example.datvexemphim.entity.DichVu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.DichVuRepository;
import com.example.datvexemphim.service.DichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DichVuServiceImpl implements DichVuService {

    @Autowired
    private DichVuRepository repository;

    private DichVuResponse mapToResponse(DichVu entity) {
        return DichVuResponse.builder()
                .id(entity.getId())
                .loaiDichVuId(entity.getLoaiDichVuId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .giaBan(entity.getGiaBan())
                .hinhAnh(entity.getHinhAnh())
                .moTa(entity.getMoTa())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<DichVuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public DichVuResponse getById(UUID id) {
        DichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public DichVuResponse create(DichVuRequest request) {
        DichVu entity = new DichVu();
        entity.setLoaiDichVuId(request.getLoaiDichVuId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setGiaBan(request.getGiaBan());
        entity.setHinhAnh(request.getHinhAnh());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public DichVuResponse update(UUID id, DichVuRequest request) {
        DichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setLoaiDichVuId(request.getLoaiDichVuId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setGiaBan(request.getGiaBan());
        entity.setHinhAnh(request.getHinhAnh());
        entity.setMoTa(request.getMoTa());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        DichVu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setTrangThai(3);
        repository.save(entity);
    }
}
