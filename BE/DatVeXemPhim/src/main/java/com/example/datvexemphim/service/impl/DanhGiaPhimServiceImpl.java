package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.DanhGiaPhimRequest;
import com.example.datvexemphim.dto.response.DanhGiaPhimResponse;
import com.example.datvexemphim.entity.DanhGiaPhim;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.DanhGiaPhimRepository;
import com.example.datvexemphim.service.DanhGiaPhimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DanhGiaPhimServiceImpl implements DanhGiaPhimService {

    @Autowired
    private DanhGiaPhimRepository repository;

    private DanhGiaPhimResponse mapToResponse(DanhGiaPhim entity) {
        return DanhGiaPhimResponse.builder()
                .id(entity.getId())
                .phimId(entity.getPhimId())
                .khachHangId(entity.getKhachHangId())
                .diemSo(entity.getDiemSo())
                .binhLuan(entity.getBinhLuan())
                .ngayTao(entity.getNgayTao())
                .build();
    }

    @Override
    public List<DanhGiaPhimResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public DanhGiaPhimResponse getById(UUID id) {
        DanhGiaPhim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public DanhGiaPhimResponse create(DanhGiaPhimRequest request) {
        DanhGiaPhim entity = new DanhGiaPhim();
        entity.setPhimId(request.getPhimId());
        entity.setKhachHangId(request.getKhachHangId());
        entity.setDiemSo(request.getDiemSo());
        entity.setBinhLuan(request.getBinhLuan());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public DanhGiaPhimResponse update(UUID id, DanhGiaPhimRequest request) {
        DanhGiaPhim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setPhimId(request.getPhimId());
        entity.setKhachHangId(request.getKhachHangId());
        entity.setDiemSo(request.getDiemSo());
        entity.setBinhLuan(request.getBinhLuan());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
