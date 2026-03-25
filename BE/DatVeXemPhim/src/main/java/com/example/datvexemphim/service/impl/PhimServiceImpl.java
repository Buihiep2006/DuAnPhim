package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.PhimRequest;
import com.example.datvexemphim.dto.response.PhimResponse;
import com.example.datvexemphim.entity.*;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.*;
import com.example.datvexemphim.service.PhimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PhimServiceImpl implements PhimService {

    @Autowired private PhimRepository repository;
    @Autowired private PhimTheLoaiRepository phimTheLoaiRepository;
    @Autowired private TheLoaiPhimRepository theLoaiPhimRepository;
    @Autowired private PhimDaoDienRepository phimDaoDienRepository;
    @Autowired private DaoDienRepository daoDienRepository;
    @Autowired private PhimDienVienRepository phimDienVienRepository;
    @Autowired private DienVienRepository dienVienRepository;
    @Autowired private PhimNgonNguRepository phimNgonNguRepository;
    @Autowired private NgonNguRepository ngonNguRepository;
    @Autowired private PhanLoaiDoTuoiRepository phanLoaiDoTuoiRepository;
    @Autowired private SuatChieuRepository suatChieuRepository;

    private PhimResponse mapToResponse(Phim entity) {
        // Fetch relationships
        List<PhimTheLoai> phimTheLoais = phimTheLoaiRepository.findByPhimId(entity.getId());
        List<String> theLoai = phimTheLoais.stream()
                .map(pt -> pt.getTheLoai().getTen()).collect(Collectors.toList());
        List<UUID> theLoaiIds = phimTheLoais.stream()
                .map(pt -> pt.getTheLoai().getId()).collect(Collectors.toList());
        
        List<String> daoDien = phimDaoDienRepository.findByPhimId(entity.getId()).stream()
                .map(pd -> pd.getDaoDien().getTen()).collect(Collectors.toList());
        List<String> dienVien = phimDienVienRepository.findByPhimId(entity.getId()).stream()
                .map(pv -> pv.getDienVien().getTen()).collect(Collectors.toList());
        List<String> ngonNgu = phimNgonNguRepository.findByPhimId(entity.getId()).stream()
                .map(pn -> pn.getNgonNgu().getTen()).collect(Collectors.toList());

        String phanLoaiDoTuoi = "";
        if (entity.getPhanLoaiDoTuoiId() != null) {
            phanLoaiDoTuoi = phanLoaiDoTuoiRepository.findById(entity.getPhanLoaiDoTuoiId())
                    .map(PhanLoaiDoTuoi::getMa).orElse("");
        }

        return PhimResponse.builder()
                .id(entity.getId())
                .phanLoaiDoTuoiId(entity.getPhanLoaiDoTuoiId())
                .ma(entity.getMa())
                .ten(entity.getTen())
                .thoiLuong(entity.getThoiLuong())
                .ngayCongChieu(entity.getNgayCongChieu())
                .ngayKetThuc(entity.getNgayKetThuc())
                .hinhAnhPoster(entity.getHinhAnhPoster())
                .hinhAnhBanner(entity.getHinhAnhBanner())
                .trailerUrl(entity.getTrailerUrl())
                .moTa(entity.getMoTa())
                .metadata(entity.getMetadata())
                .trangThai(entity.getTrangThai())
                .ngayTao(entity.getNgayTao())
                .phanLoaiDoTuoi(phanLoaiDoTuoi)
                .theLoai(theLoai)
                .theLoaiIds(theLoaiIds)
                .daoDien(daoDien)
                .dienVien(dienVien)
                .ngonNgu(ngonNgu)
                .rapChieuIds(suatChieuRepository.findDistinctRapChieuIdsByPhimId(entity.getId()))
                .build();
    }

    @Override
    public List<PhimResponse> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PhimResponse getById(UUID id) {
        Phim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Transactional
    @Override
    public PhimResponse create(PhimRequest request) {
        Phim entity = new Phim();
        mapToEntity(request, entity);
        Phim saved = repository.save(entity);
        saveRelationships(saved.getId(), request);
        return mapToResponse(saved);
    }

    @Transactional
    @Override
    public PhimResponse update(UUID id, PhimRequest request) {
        Phim entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        mapToEntity(request, entity);
        Phim saved = repository.save(entity);
        
        // Delete old relationships
        phimTheLoaiRepository.deleteByPhimId(id);
        phimDaoDienRepository.deleteByPhimId(id);
        phimDienVienRepository.deleteByPhimId(id);
        phimNgonNguRepository.deleteByPhimId(id);
        
        // Save new relationships
        saveRelationships(id, request);
        return mapToResponse(saved);
    }

    @Transactional
    @Override
    public void delete(UUID id) {
        Phim phim = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        phim.setTrangThai(3);
        repository.save(phim);
    }

    private void mapToEntity(PhimRequest request, Phim entity) {
        entity.setPhanLoaiDoTuoiId(request.getPhanLoaiDoTuoiId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setThoiLuong(request.getThoiLuong());
        entity.setNgayCongChieu(request.getNgayCongChieu());
        entity.setNgayKetThuc(request.getNgayKetThuc());
        entity.setHinhAnhPoster(request.getHinhAnhPoster());
        entity.setHinhAnhBanner(request.getHinhAnhBanner());
        entity.setTrailerUrl(request.getTrailerUrl());
        entity.setMoTa(request.getMoTa());
        entity.setMetadata(request.getMetadata());
        entity.setTrangThai(request.getTrangThai());
        entity.setNgayTao(request.getNgayTao());
    }

    private void saveRelationships(UUID phimId, PhimRequest request) {
        Phim phim = repository.findById(phimId).orElseThrow();

        if (request.getTheLoaiIds() != null) {
            for (UUID tId : request.getTheLoaiIds()) {
                TheLoaiPhim tObj = theLoaiPhimRepository.findById(tId).orElse(null);
                if (tObj != null) {
                    PhimTheLoaiId id = new PhimTheLoaiId();
                    id.setPhimId(phimId);
                    id.setTheLoaiId(tId);
                    PhimTheLoai ptl = new PhimTheLoai();
                    ptl.setId(id);
                    ptl.setPhim(phim);
                    ptl.setTheLoai(tObj);
                    phimTheLoaiRepository.save(ptl);
                }
            }
        }

        if (request.getDaoDienIds() != null) {
            for (UUID dId : request.getDaoDienIds()) {
                DaoDien dObj = daoDienRepository.findById(dId).orElse(null);
                if (dObj != null) {
                    PhimDaoDienId id = new PhimDaoDienId();
                    id.setPhimId(phimId);
                    id.setDaoDienId(dId);
                    PhimDaoDien pdd = new PhimDaoDien();
                    pdd.setId(id);
                    pdd.setPhim(phim);
                    pdd.setDaoDien(dObj);
                    phimDaoDienRepository.save(pdd);
                }
            }
        }

        if (request.getDienVienIds() != null) {
            for (UUID vId : request.getDienVienIds()) {
                DienVien vObj = dienVienRepository.findById(vId).orElse(null);
                if (vObj != null) {
                    PhimDienVienId id = new PhimDienVienId();
                    id.setPhimId(phimId);
                    id.setDienVienId(vId);
                    PhimDienVien pdv = new PhimDienVien();
                    pdv.setId(id);
                    pdv.setPhim(phim);
                    pdv.setDienVien(vObj);
                    phimDienVienRepository.save(pdv);
                }
            }
        }

        if (request.getNgonNguIds() != null) {
            for (UUID nId : request.getNgonNguIds()) {
                NgonNgu nObj = ngonNguRepository.findById(nId).orElse(null);
                if (nObj != null) {
                    PhimNgonNguId id = new PhimNgonNguId();
                    id.setPhimId(phimId);
                    id.setNgonNguId(nId);
                    PhimNgonNgu pnn = new PhimNgonNgu();
                    pnn.setId(id);
                    pnn.setPhim(phim);
                    pnn.setNgonNgu(nObj);
                    phimNgonNguRepository.save(pnn);
                }
            }
        }
    }
}
