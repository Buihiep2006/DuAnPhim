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

    @Autowired private com.example.datvexemphim.repository.PhimRepository phimRepository;
    @Autowired private com.example.datvexemphim.repository.PhongChieuRepository phongChieuRepository;
    @Autowired private com.example.datvexemphim.repository.RapChieuRepository rapChieuRepository;
    @Autowired private com.example.datvexemphim.repository.DinhDangPhimRepository dinhDangPhimRepository;

    private SuatChieuResponse mapToResponse(SuatChieu entity) {
        String tenPhim = "";
        String hinhAnhPoster = "";
        if (entity.getPhimId() != null) {
            var phim = phimRepository.findById(entity.getPhimId()).orElse(null);
            if (phim != null) {
                tenPhim = phim.getTen();
                hinhAnhPoster = phim.getHinhAnhPoster();
            }
        }

        String tenPhongChieu = "";
        String tenRapChieu = "";
        String diaChiRapChieu = "";
        if (entity.getPhongChieuId() != null) {
            var phong = phongChieuRepository.findById(entity.getPhongChieuId()).orElse(null);
            if (phong != null) {
                tenPhongChieu = phong.getTen();
                var rap = rapChieuRepository.findById(phong.getRapChieuId()).orElse(null);
                if (rap != null) {
                    tenRapChieu = rap.getTen();
                    diaChiRapChieu = rap.getDiaChi();
                }
            }
        }

        String tenDinhDangPhim = "";
        if (entity.getDinhDangPhimId() != null) {
            tenDinhDangPhim = dinhDangPhimRepository.findById(entity.getDinhDangPhimId())
                    .map(d -> d.getTen()).orElse("");
        }

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
                .tenPhim(tenPhim)
                .hinhAnhPoster(hinhAnhPoster)
                .tenPhongChieu(tenPhongChieu)
                .tenRapChieu(tenRapChieu)
                .diaChiRapChieu(diaChiRapChieu)
                .tenDinhDangPhim(tenDinhDangPhim)
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
    public List<SuatChieuResponse> getByPhimId(UUID phimId) {
        return repository.findByPhimId(phimId).stream()
                .filter(s -> s.getTrangThai() != 3) // Exclude deleted
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
        SuatChieu entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setTrangThai(3);
        repository.save(entity);
    }
}
