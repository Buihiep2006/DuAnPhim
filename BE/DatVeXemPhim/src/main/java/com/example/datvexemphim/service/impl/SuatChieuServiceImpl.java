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
    @Autowired private com.example.datvexemphim.repository.CaiDatChungRepository caiDatChungRepository;

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

    @Override
    public List<SuatChieuResponse> generate(UUID phimId, UUID phongChieuId, java.time.LocalDate ngayChieu, UUID dinhDangPhimId, java.time.LocalTime customGioMo, java.time.LocalTime customGioDong) {
        var phim = phimRepository.findById(phimId).orElseThrow(() -> new ResourceNotFoundException("Phim not found"));
        
        if (phim.getNgayCongChieu() != null && ngayChieu.isBefore(phim.getNgayCongChieu().toLocalDate())) {
            throw new RuntimeException("Ngày " + ngayChieu + " trước ngày công chiếu của phim (" + phim.getNgayCongChieu().toLocalDate() + ")");
        }
        if (phim.getNgayKetThuc() != null && ngayChieu.isAfter(phim.getNgayKetThuc().toLocalDate())) {
            throw new RuntimeException("Ngày " + ngayChieu + " sau ngày kết thúc của phim (" + phim.getNgayKetThuc().toLocalDate() + ")");
        }

        var settingsList = caiDatChungRepository.findAll();
        if (settingsList.isEmpty()) throw new RuntimeException("Chưa có cấu hình cài đặt chung");
        var settings = settingsList.get(0);

        java.time.LocalTime gioMo = customGioMo != null ? customGioMo : (settings.getGioMoCua() != null ? settings.getGioMoCua() : java.time.LocalTime.of(8, 0));
        java.time.LocalTime gioDong = customGioDong != null ? customGioDong : (settings.getGioDongCua() != null ? settings.getGioDongCua() : java.time.LocalTime.of(23, 0));
        int gap = settings.getThoiGianNghiSuatChieu() != null ? settings.getThoiGianNghiSuatChieu() : 15;
        int duration = phim.getThoiLuong() != null && phim.getThoiLuong() > 0 ? phim.getThoiLuong() : 120;

        java.time.LocalDateTime currentStart = ngayChieu.atTime(gioMo);
        java.time.LocalDateTime closingTime = ngayChieu.atTime(gioDong);
        
        // If closing time is before or equal to opening time (e.g. midnight or overnight)
        if (closingTime.isBefore(currentStart) || closingTime.isEqual(currentStart)) {
            closingTime = closingTime.plusDays(1);
        }

        // Fetch existing showtimes for this room and day to avoid overlaps
        List<SuatChieu> existing = repository.findByPhongChieuIdAndThoiGianBatDauBetween(
                phongChieuId, ngayChieu.atStartOfDay(), ngayChieu.plusDays(1).atStartOfDay());

        List<SuatChieu> generated = new java.util.ArrayList<>();
        int count = 1;

        while (count < 50 && (currentStart.plusMinutes(duration).isBefore(closingTime) || currentStart.plusMinutes(duration).isEqual(closingTime))) {
            java.time.LocalDateTime potentialEnd = currentStart.plusMinutes(duration);
            
            // Overlap check
            boolean overlaps = false;
            java.time.LocalDateTime finalCurrentStart = currentStart;
            for (SuatChieu ex : existing) {
                // Check if [currentStart, potentialEnd] overlaps with [exStart, exEnd]
                if (!(potentialEnd.isBefore(ex.getThoiGianBatDau()) || potentialEnd.isEqual(ex.getThoiGianBatDau()) 
                        || finalCurrentStart.isAfter(ex.getThoiGianKetThuc()) || finalCurrentStart.isEqual(ex.getThoiGianKetThuc()))) {
                    overlaps = true;
                    // Jump to after this existing showtime + gap
                    currentStart = ex.getThoiGianKetThuc().plusMinutes(gap);
                    break;
                }
            }
            
            if (overlaps) continue;

            SuatChieu sc = new SuatChieu();
            sc.setPhimId(phimId);
            sc.setPhongChieuId(phongChieuId);
            sc.setDinhDangPhimId(dinhDangPhimId);
            String roomPart = phongChieuId.toString().substring(0, 4);
            sc.setMa("AT_" + roomPart + "_" + ngayChieu.toString().replace("-", "").substring(4) + "_" + count++);
            sc.setThoiGianBatDau(currentStart);
            sc.setThoiGianKetThuc(potentialEnd);
            sc.setGiaVeCoBan(settings.getGiaVeCoBanMacDinh() != null ? settings.getGiaVeCoBanMacDinh() : java.math.BigDecimal.valueOf(80000.0));
            sc.setTrangThai(1);
            sc.setNgayTao(java.time.LocalDateTime.now());
            
            generated.add(repository.save(sc));
            
            currentStart = sc.getThoiGianKetThuc().plusMinutes(gap);
        }

        return generated.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
}
