package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.VeBanRequest;
import com.example.datvexemphim.dto.response.VeBanResponse;
import com.example.datvexemphim.entity.VeBan;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.VeBanRepository;
import com.example.datvexemphim.service.VeBanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VeBanServiceImpl implements VeBanService {

    @Autowired
    private VeBanRepository repository;

    private VeBanResponse mapToResponse(VeBan entity) {
        return VeBanResponse.builder()
                .id(entity.getId())
                .suatChieuId(entity.getSuatChieuId())
                .gheNgoiId(entity.getGheNgoiId())
                .maVe(entity.getMaVe())
                .giaVeThucTe(entity.getGiaVeThucTe())
                .thoiGianCheckIn(entity.getThoiGianCheckIn())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<VeBanResponse> getBySuatChieuId(UUID suatChieuId) {
        return repository.findBySuatChieuId(suatChieuId).stream()
                .filter(v -> v.getTrangThai() != 3) // Exclude cancelled
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VeBanResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public VeBanResponse getById(UUID id) {
        VeBan entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public VeBanResponse create(VeBanRequest request) {
        VeBan entity = new VeBan();
        entity.setSuatChieuId(request.getSuatChieuId());
        entity.setGheNgoiId(request.getGheNgoiId());
        entity.setMaVe(request.getMaVe());
        entity.setGiaVeThucTe(request.getGiaVeThucTe());
        entity.setThoiGianCheckIn(request.getThoiGianCheckIn());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public VeBanResponse update(UUID id, VeBanRequest request) {
        VeBan entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setSuatChieuId(request.getSuatChieuId());
        entity.setGheNgoiId(request.getGheNgoiId());
        entity.setMaVe(request.getMaVe());
        entity.setGiaVeThucTe(request.getGiaVeThucTe());
        entity.setThoiGianCheckIn(request.getThoiGianCheckIn());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
