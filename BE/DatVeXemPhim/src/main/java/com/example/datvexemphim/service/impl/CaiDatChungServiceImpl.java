package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.CaiDatChungRequest;
import com.example.datvexemphim.dto.response.CaiDatChungResponse;
import com.example.datvexemphim.entity.CaiDatChung;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.CaiDatChungRepository;
import com.example.datvexemphim.service.CaiDatChungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CaiDatChungServiceImpl implements CaiDatChungService {

    @Autowired
    private CaiDatChungRepository repository;

    private CaiDatChungResponse mapToResponse(CaiDatChung entity) {
        return CaiDatChungResponse.builder()
                .id(entity.getId())
                .thoiGianGiuGhe(entity.getThoiGianGiuGhe())
                .thoiGianNghiSuatChieu(entity.getThoiGianNghiSuatChieu())
                .gioMoCua(entity.getGioMoCua())
                .gioDongCua(entity.getGioDongCua())
                .giaVeCoBanMacDinh(entity.getGiaVeCoBanMacDinh())
                .tyLeTichDiem(entity.getTyLeTichDiem())
                .build();
    }

    @Override
    public List<CaiDatChungResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public CaiDatChungResponse getById(UUID id) {
        CaiDatChung entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public CaiDatChungResponse create(CaiDatChungRequest request) {
        CaiDatChung entity = new CaiDatChung();
        entity.setThoiGianGiuGhe(request.getThoiGianGiuGhe());
        entity.setThoiGianNghiSuatChieu(request.getThoiGianNghiSuatChieu());
        entity.setGioMoCua(request.getGioMoCua());
        entity.setGioDongCua(request.getGioDongCua());
        entity.setGiaVeCoBanMacDinh(request.getGiaVeCoBanMacDinh());
        entity.setTyLeTichDiem(request.getTyLeTichDiem());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public CaiDatChungResponse update(UUID id, CaiDatChungRequest request) {
        CaiDatChung entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setThoiGianGiuGhe(request.getThoiGianGiuGhe());
        entity.setThoiGianNghiSuatChieu(request.getThoiGianNghiSuatChieu());
        entity.setGioMoCua(request.getGioMoCua());
        entity.setGioDongCua(request.getGioDongCua());
        entity.setGiaVeCoBanMacDinh(request.getGiaVeCoBanMacDinh());
        entity.setTyLeTichDiem(request.getTyLeTichDiem());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
