package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.GheNgoiRequest;
import com.example.datvexemphim.dto.response.GheNgoiResponse;
import com.example.datvexemphim.entity.GheNgoi;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.GheNgoiRepository;
import com.example.datvexemphim.service.GheNgoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GheNgoiServiceImpl implements GheNgoiService {

    @Autowired
    private GheNgoiRepository repository;

    @Autowired
    private com.example.datvexemphim.repository.LoaiGheRepository loaiGheRepository;

    private GheNgoiResponse mapToResponse(GheNgoi entity) {
        String loaiGheTen = "";
        java.math.BigDecimal phuThu = java.math.BigDecimal.ZERO;
        if (entity.getLoaiGheId() != null) {
            var loai = loaiGheRepository.findById(entity.getLoaiGheId()).orElse(null);
            if (loai != null) {
                loaiGheTen = loai.getTen();
                phuThu = loai.getPhuThu();
            }
        }

        return GheNgoiResponse.builder()
                .id(entity.getId())
                .phongChieuId(entity.getPhongChieuId())
                .loaiGheId(entity.getLoaiGheId())
                .maGhe(entity.getMaGhe())
                .hangGhe(entity.getHangGhe())
                .soThuTu(entity.getSoThuTu())
                .trangThai(entity.getTrangThai())
                .loaiGheTen(loaiGheTen)
                .phuThu(phuThu)
                .build();
    }

    @Override
    public List<GheNgoiResponse> getByPhongChieuId(UUID phongChieuId) {
        return repository.findByPhongChieuId(phongChieuId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<GheNgoiResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public GheNgoiResponse getById(UUID id) {
        GheNgoi entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public GheNgoiResponse create(GheNgoiRequest request) {
        GheNgoi entity = new GheNgoi();
        entity.setPhongChieuId(request.getPhongChieuId());
        entity.setLoaiGheId(request.getLoaiGheId());
        entity.setMaGhe(request.getMaGhe());
        entity.setHangGhe(request.getHangGhe());
        entity.setSoThuTu(request.getSoThuTu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public GheNgoiResponse update(UUID id, GheNgoiRequest request) {
        GheNgoi entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setPhongChieuId(request.getPhongChieuId());
        entity.setLoaiGheId(request.getLoaiGheId());
        entity.setMaGhe(request.getMaGhe());
        entity.setHangGhe(request.getHangGhe());
        entity.setSoThuTu(request.getSoThuTu());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
