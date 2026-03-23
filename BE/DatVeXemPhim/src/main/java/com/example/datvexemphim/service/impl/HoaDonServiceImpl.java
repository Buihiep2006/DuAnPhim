package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.HoaDonRequest;
import com.example.datvexemphim.dto.response.HoaDonResponse;
import com.example.datvexemphim.entity.HoaDon;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.HoaDonRepository;
import com.example.datvexemphim.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HoaDonServiceImpl implements HoaDonService {

    @Autowired
    private HoaDonRepository repository;

    private HoaDonResponse mapToResponse(HoaDon entity) {
        return HoaDonResponse.builder()
                .id(entity.getId())
                .khachHangId(entity.getKhachHangId())
                .nhanVienId(entity.getNhanVienId())
                .khuyenMaiId(entity.getKhuyenMaiId())
                .maHoaDon(entity.getMaHoaDon())
                .tongTienBanDau(entity.getTongTienBanDau())
                .soTienGiam(entity.getSoTienGiam())
                .tongTienThanhToan(entity.getTongTienThanhToan())
                .diemThuongSuDung(entity.getDiemThuongSuDung())
                .diemThuongNhanDuoc(entity.getDiemThuongNhanDuoc())
                .thoiGianTao(entity.getThoiGianTao())
                .thoiGianHetHanGiuGhe(entity.getThoiGianHetHanGiuGhe())
                .trangThai(entity.getTrangThai())
                .build();
    }

    @Override
    public List<HoaDonResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public HoaDonResponse getById(UUID id) {
        HoaDon entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public HoaDonResponse create(HoaDonRequest request) {
        HoaDon entity = new HoaDon();
        entity.setKhachHangId(request.getKhachHangId());
        entity.setNhanVienId(request.getNhanVienId());
        entity.setKhuyenMaiId(request.getKhuyenMaiId());
        entity.setMaHoaDon(request.getMaHoaDon());
        entity.setTongTienBanDau(request.getTongTienBanDau());
        entity.setSoTienGiam(request.getSoTienGiam());
        entity.setTongTienThanhToan(request.getTongTienThanhToan());
        entity.setDiemThuongSuDung(request.getDiemThuongSuDung());
        entity.setDiemThuongNhanDuoc(request.getDiemThuongNhanDuoc());
        entity.setThoiGianTao(request.getThoiGianTao());
        entity.setThoiGianHetHanGiuGhe(request.getThoiGianHetHanGiuGhe());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public HoaDonResponse update(UUID id, HoaDonRequest request) {
        HoaDon entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        entity.setKhachHangId(request.getKhachHangId());
        entity.setNhanVienId(request.getNhanVienId());
        entity.setKhuyenMaiId(request.getKhuyenMaiId());
        entity.setMaHoaDon(request.getMaHoaDon());
        entity.setTongTienBanDau(request.getTongTienBanDau());
        entity.setSoTienGiam(request.getSoTienGiam());
        entity.setTongTienThanhToan(request.getTongTienThanhToan());
        entity.setDiemThuongSuDung(request.getDiemThuongSuDung());
        entity.setDiemThuongNhanDuoc(request.getDiemThuongNhanDuoc());
        entity.setThoiGianTao(request.getThoiGianTao());
        entity.setThoiGianHetHanGiuGhe(request.getThoiGianHetHanGiuGhe());
        entity.setTrangThai(request.getTrangThai());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
