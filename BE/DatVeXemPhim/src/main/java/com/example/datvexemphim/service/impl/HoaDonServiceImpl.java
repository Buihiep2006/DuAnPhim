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

    @Autowired
    private com.example.datvexemphim.repository.VeBanRepository veBanRepository;

    @Autowired
    private com.example.datvexemphim.repository.ChiTietHoaDonVeRepository chiTietVeRepository;

    @Autowired
    private com.example.datvexemphim.repository.ChiTietHoaDonDichVuRepository chiTietDichVuRepository;

    @Autowired
    private com.example.datvexemphim.repository.KhachHangRepository khachHangRepository;

    @Autowired
    private com.example.datvexemphim.repository.SuatChieuRepository suatChieuRepository;

    @Autowired
    private com.example.datvexemphim.repository.PhimRepository phimRepository;

    @Autowired
    private com.example.datvexemphim.repository.GheNgoiRepository gheNgoiRepository;

    @Autowired
    private com.example.datvexemphim.repository.RapChieuRepository rapChieuRepository;

    @Autowired
    private com.example.datvexemphim.repository.PhongChieuRepository phongChieuRepository;

    @Autowired
    private com.example.datvexemphim.repository.DichVuRepository dichVuRepository;

    @Override
    public java.util.List<com.example.datvexemphim.dto.response.BookingHistoryResponse> getBookingHistory(java.util.UUID khachHangId) {
        java.util.List<HoaDon> invoices = repository.findByKhachHangIdOrderByThoiGianTaoDesc(khachHangId);
        java.util.List<com.example.datvexemphim.dto.response.BookingHistoryResponse> history = new java.util.ArrayList<>();

        for (HoaDon hd : invoices) {
            var hb = com.example.datvexemphim.dto.response.BookingHistoryResponse.builder()
                    .id(hd.getId())
                    .maHoaDon(hd.getMaHoaDon())
                    .thoiGianTao(hd.getThoiGianTao())
                    .tongTienThanhToan(hd.getTongTienThanhToan())
                    .trangThai(hd.getTrangThai())
                    .danhSachGhe(new java.util.ArrayList<>())
                    .danhSachDichVu(new java.util.ArrayList<>())
                    .build();

            // Fetch Ticket Details
            java.util.List<com.example.datvexemphim.entity.ChiTietHoaDonVe> ctVes = chiTietVeRepository.findByHoaDonId(hd.getId());
            if (!ctVes.isEmpty()) {
                // Get Showtime Info from the first ticket (all tickets in one invoice should be for same showtime)
                com.example.datvexemphim.entity.VeBan firstVe = veBanRepository.findById(ctVes.get(0).getVeBanId()).orElse(null);
                if (firstVe != null) {
                    com.example.datvexemphim.entity.SuatChieu sc = suatChieuRepository.findById(firstVe.getSuatChieuId()).orElse(null);
                    if (sc != null) {
                        hb.setThoiGianBatDau(sc.getThoiGianBatDau());
                        phimRepository.findById(sc.getPhimId()).ifPresent(p -> hb.setTenPhim(p.getTen()));
                        phongChieuRepository.findById(sc.getPhongChieuId()).ifPresent(pc -> {
                            hb.setTenPhong(pc.getTen());
                            rapChieuRepository.findById(pc.getRapChieuId()).ifPresent(r -> hb.setTenRap(r.getTen()));
                        });
                    }
                }

                // Collect Seat Names
                for (var ct : ctVes) {
                    veBanRepository.findById(ct.getVeBanId()).ifPresent(ve -> {
                        gheNgoiRepository.findById(ve.getGheNgoiId()).ifPresent(g -> hb.getDanhSachGhe().add(g.getMaGhe()));
                    });
                }
            }

            // Fetch Service Details
            java.util.List<com.example.datvexemphim.entity.ChiTietHoaDonDichVu> ctDvs = chiTietDichVuRepository.findByHoaDonId(hd.getId());
            for (var ct : ctDvs) {
                dichVuRepository.findById(ct.getDichVuId()).ifPresent(dv -> {
                    hb.getDanhSachDichVu().add(dv.getTen() + " (x" + ct.getSoLuong() + ")");
                });
            }

            history.add(hb);
        }
        return history;
    }

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
    @org.springframework.transaction.annotation.Transactional
    public HoaDonResponse checkout(com.example.datvexemphim.dto.request.BookingRequest request) {
        // 1. Create HoaDon
        HoaDon hd = new HoaDon();
        hd.setKhachHangId(request.getKhachHangId());
        hd.setKhuyenMaiId(request.getKhuyenMaiId());
        hd.setMaHoaDon("HD" + System.currentTimeMillis());
        hd.setTongTienBanDau(request.getTongTienBanDau());
        hd.setSoTienGiam(request.getSoTienGiam());
        hd.setTongTienThanhToan(request.getTongTienThanhToan());
        hd.setDiemThuongSuDung(request.getDiemThuongSuDung());
        hd.setThoiGianTao(java.time.LocalDateTime.now());
        hd.setThoiGianHetHanGiuGhe(java.time.LocalDateTime.now().plusMinutes(15));
        hd.setTrangThai(1); // 1: Da thanh toan / Cho thanh toan tùy logic
        
        hd = repository.save(hd);

        // 2. Create VeBan and ChiTietVe
        if (request.getGheNgoiIds() != null) {
            for (UUID gheId : request.getGheNgoiIds()) {
                // Check if seat is already taken for this showtime
                var existing = veBanRepository.findBySuatChieuId(request.getSuatChieuId())
                        .stream().filter(v -> v.getGheNgoiId().equals(gheId) && v.getTrangThai() != 3)
                        .findFirst();
                if (existing.isPresent()) {
                    throw new RuntimeException("Ghế " + gheId + " đã có người đặt!");
                }

                com.example.datvexemphim.entity.VeBan ve = new com.example.datvexemphim.entity.VeBan();
                ve.setSuatChieuId(request.getSuatChieuId());
                ve.setGheNgoiId(gheId);
                ve.setMaVe("VE" + System.currentTimeMillis() + gheId.toString().substring(0, 4));
                ve.setGiaVeThucTe(request.getTongTienThanhToan().divide(new java.math.BigDecimal(request.getGheNgoiIds().size()), java.math.RoundingMode.HALF_UP));
                ve.setTrangThai(1);
                ve = veBanRepository.save(ve);

                com.example.datvexemphim.entity.ChiTietHoaDonVe ctVe = new com.example.datvexemphim.entity.ChiTietHoaDonVe();
                ctVe.setHoaDonId(hd.getId());
                ctVe.setVeBanId(ve.getId());
                ctVe.setThanhTien(ve.getGiaVeThucTe());
                chiTietVeRepository.save(ctVe);
            }
        }

        // 3. Create ChiTietDichVu
        if (request.getServices() != null) {
            for (var s : request.getServices()) {
                com.example.datvexemphim.entity.ChiTietHoaDonDichVu ctDv = new com.example.datvexemphim.entity.ChiTietHoaDonDichVu();
                ctDv.setHoaDonId(hd.getId());
                ctDv.setDichVuId(s.getDichVuId());
                ctDv.setSoLuong(s.getSoLuong());
                ctDv.setDonGia(s.getDonGia());
                ctDv.setThanhTien(s.getDonGia().multiply(new java.math.BigDecimal(s.getSoLuong())));
                chiTietDichVuRepository.save(ctDv);
            }
        }

        // 4. Update customer points
        if (request.getKhachHangId() != null && request.getDiemThuongSuDung() != null && request.getDiemThuongSuDung() > 0) {
            var kh = khachHangRepository.findById(request.getKhachHangId()).orElse(null);
            if (kh != null) {
                kh.setDiemTichLuy(kh.getDiemTichLuy() - request.getDiemThuongSuDung());
                khachHangRepository.save(kh);
            }
        }

        return mapToResponse(hd);
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
