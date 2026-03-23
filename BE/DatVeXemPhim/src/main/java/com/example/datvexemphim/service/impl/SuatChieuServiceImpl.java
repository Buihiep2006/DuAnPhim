package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.SuatChieuRequest;
import com.example.datvexemphim.dto.response.SuatChieuResponse;
import com.example.datvexemphim.entity.SuatChieu;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.SuatChieuRepository;
import com.example.datvexemphim.service.SuatChieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SuatChieuServiceImpl implements SuatChieuService {

    @Autowired
    private SuatChieuRepository repository;

    private SuatChieuResponse mapToResponse(SuatChieu entity) {
        return SuatChieuResponse.builder()
                .id(entity.getId())
                .phimId(entity.getPhimId())
                .phongChieuId(entity.getPhongChieuId())
                .dinhDangPhimId(entity.getDinhDangPhimId())
                .ma(entity.getMa())
                .thoiGianBatDau(entity.getThoiGianBatDau())
                .thoiGianKetThuc(entity.getThoiGianKetThuc())
                .giaVeCoBan(entity.getGiaVeCoBan())
                .trangThai(entity.getTrangThai())
                .ngayTao(entity.getNgayTao())
                .build();
    }

    @Override
    public List<SuatChieuResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public SuatChieuResponse getById(UUID id) {
        SuatChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public SuatChieuResponse create(SuatChieuRequest request) {
        SuatChieu entity = new SuatChieu();
        entity.setPhimId(request.getPhimId());
        entity.setPhongChieuId(request.getPhongChieuId());
        entity.setDinhDangPhimId(request.getDinhDangPhimId());
        entity.setMa(request.getMa());
        entity.setThoiGianBatDau(request.getThoiGianBatDau());
        entity.setThoiGianKetThuc(request.getThoiGianKetThuc());
        entity.setGiaVeCoBan(request.getGiaVeCoBan());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public SuatChieuResponse update(UUID id, SuatChieuRequest request) {
        SuatChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setPhimId(request.getPhimId());
        entity.setPhongChieuId(request.getPhongChieuId());
        entity.setDinhDangPhimId(request.getDinhDangPhimId());
        entity.setMa(request.getMa());
        entity.setThoiGianBatDau(request.getThoiGianBatDau());
        entity.setThoiGianKetThuc(request.getThoiGianKetThuc());
        entity.setGiaVeCoBan(request.getGiaVeCoBan());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
