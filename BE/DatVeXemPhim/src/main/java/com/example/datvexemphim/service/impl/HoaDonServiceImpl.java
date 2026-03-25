package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.BookingRequest;
import com.example.datvexemphim.dto.request.HoaDonRequest;
import com.example.datvexemphim.dto.response.BookingHistoryResponse;
import com.example.datvexemphim.dto.response.HoaDonResponse;
import com.example.datvexemphim.entity.CaiDatChung;
import com.example.datvexemphim.entity.ChiTietHoaDonVe;
import com.example.datvexemphim.entity.HoaDon;
import com.example.datvexemphim.entity.KhachHang;
import com.example.datvexemphim.entity.KhuyenMai;
import com.example.datvexemphim.entity.SuatChieu;
import com.example.datvexemphim.exception.BadRequestException;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.CaiDatChungRepository;
import com.example.datvexemphim.repository.ChiTietHoaDonDichVuRepository;
import com.example.datvexemphim.repository.ChiTietHoaDonVeRepository;
import com.example.datvexemphim.repository.DichVuRepository;
import com.example.datvexemphim.repository.GheNgoiRepository;
import com.example.datvexemphim.repository.HoaDonRepository;
import com.example.datvexemphim.repository.KhachHangRepository;
import com.example.datvexemphim.repository.KhuyenMaiRepository;
import com.example.datvexemphim.repository.LoaiGheRepository;
import com.example.datvexemphim.repository.PhimRepository;
import com.example.datvexemphim.repository.PhongChieuRepository;
import com.example.datvexemphim.repository.RapChieuRepository;
import com.example.datvexemphim.repository.SuatChieuRepository;
import com.example.datvexemphim.repository.VeBanRepository;
import com.example.datvexemphim.security.AuthenticatedUser;
import com.example.datvexemphim.service.EmailService;
import com.example.datvexemphim.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HoaDonServiceImpl implements HoaDonService {

    private static final int INVOICE_STATUS_PAID = 1;
    private static final int INVOICE_STATUS_CANCELLED = 2;
    private static final int TICKET_STATUS_BOOKED = 1;
    private static final int TICKET_STATUS_CANCELLED = 3;
    private static final int ACTIVE_STATUS = 1;
    private static final BigDecimal POINT_VALUE = BigDecimal.valueOf(1000);
    private static final BigDecimal MAX_POINTS_DISCOUNT_RATE = BigDecimal.valueOf(0.10);

    @Autowired
    private HoaDonRepository repository;

    @Autowired
    private VeBanRepository veBanRepository;

    @Autowired
    private ChiTietHoaDonVeRepository chiTietVeRepository;

    @Autowired
    private ChiTietHoaDonDichVuRepository chiTietDichVuRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private SuatChieuRepository suatChieuRepository;

    @Autowired
    private PhimRepository phimRepository;

    @Autowired
    private GheNgoiRepository gheNgoiRepository;

    @Autowired
    private RapChieuRepository rapChieuRepository;

    @Autowired
    private PhongChieuRepository phongChieuRepository;

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private LoaiGheRepository loaiGheRepository;

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private CaiDatChungRepository caiDatChungRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<BookingHistoryResponse> getBookingHistory(UUID khachHangId) {
        enforceCustomerOwnership(khachHangId);

        List<HoaDon> invoices = repository.findByKhachHangIdOrderByThoiGianTaoDesc(khachHangId);
        List<BookingHistoryResponse> history = new ArrayList<>();

        for (HoaDon hd : invoices) {
            BookingHistoryResponse hb = BookingHistoryResponse.builder()
                    .id(hd.getId())
                    .maHoaDon(hd.getMaHoaDon())
                    .thoiGianTao(hd.getThoiGianTao())
                    .tongTienThanhToan(hd.getTongTienThanhToan())
                    .trangThai(hd.getTrangThai())
                    .danhSachGhe(new ArrayList<>())
                    .danhSachDichVu(new ArrayList<>())
                    .build();

            List<com.example.datvexemphim.entity.ChiTietHoaDonVe> ctVes = chiTietVeRepository.findByHoaDonId(hd.getId());
            if (!ctVes.isEmpty()) {
                com.example.datvexemphim.entity.VeBan firstVe = veBanRepository.findById(ctVes.get(0).getVeBanId()).orElse(null);
                if (firstVe != null) {
                    SuatChieu sc = suatChieuRepository.findById(firstVe.getSuatChieuId()).orElse(null);
                    if (sc != null) {
                        hb.setThoiGianBatDau(sc.getThoiGianBatDau());
                        phimRepository.findById(sc.getPhimId()).ifPresent(p -> hb.setTenPhim(p.getTen()));
                        phongChieuRepository.findById(sc.getPhongChieuId()).ifPresent(pc -> {
                            hb.setTenPhong(pc.getTen());
                            rapChieuRepository.findById(pc.getRapChieuId()).ifPresent(r -> hb.setTenRap(r.getTen()));
                        });
                    }
                }

                for (var ct : ctVes) {
                    veBanRepository.findById(ct.getVeBanId()).ifPresent(ve -> {
                        gheNgoiRepository.findById(ve.getGheNgoiId()).ifPresent(g -> hb.getDanhSachGhe().add(g.getMaGhe()));
                    });
                }
            }

            List<com.example.datvexemphim.entity.ChiTietHoaDonDichVu> ctDvs = chiTietDichVuRepository.findByHoaDonId(hd.getId());
            for (var ct : ctDvs) {
                dichVuRepository.findById(ct.getDichVuId()).ifPresent(dv -> hb.getDanhSachDichVu().add(dv.getTen() + " (x" + ct.getSoLuong() + ")"));
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
    @Transactional
    public HoaDonResponse checkout(BookingRequest request) {
        AuthenticatedUser currentUser = getCurrentUser();
        UUID customerId = resolveCheckoutCustomerId(request, currentUser);
        KhachHang customer = khachHangRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Khach hang khong ton tai"));
        SuatChieu showtime = suatChieuRepository.findByIdForUpdate(request.getSuatChieuId())
                .orElseThrow(() -> new ResourceNotFoundException("Suat chieu khong ton tai"));

        if (request.getGheNgoiIds() == null || request.getGheNgoiIds().isEmpty()) {
            throw new BadRequestException("Phai chon it nhat mot ghe");
        }

        Set<UUID> distinctSeatIds = new HashSet<>(request.getGheNgoiIds());
        if (distinctSeatIds.size() != request.getGheNgoiIds().size()) {
            throw new BadRequestException("Danh sach ghe co phan tu trung lap");
        }

        BigDecimal ticketTotal = BigDecimal.ZERO;
        List<String> seatNames = new ArrayList<>();
        List<BigDecimal> ticketPrices = new ArrayList<>();
        for (UUID gheId : request.getGheNgoiIds()) {
            var seat = gheNgoiRepository.findById(gheId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ghe khong ton tai: " + gheId));

            if (!showtime.getPhongChieuId().equals(seat.getPhongChieuId())) {
                throw new BadRequestException("Ghe khong thuoc phong chieu cua suat nay");
            }
            if (seat.getTrangThai() == null || seat.getTrangThai() != ACTIVE_STATUS) {
                throw new BadRequestException("Ghe " + seat.getMaGhe() + " khong kha dung");
            }

            boolean seatTaken = veBanRepository.existsBySuatChieuIdAndGheNgoiIdAndTrangThaiNot(
                    showtime.getId(),
                    gheId,
                    TICKET_STATUS_CANCELLED
            );
            if (seatTaken) {
                throw new BadRequestException("Ghe " + seat.getMaGhe() + " da co nguoi dat");
            }

            BigDecimal surcharge = BigDecimal.ZERO;
            if (seat.getLoaiGheId() != null) {
                surcharge = loaiGheRepository.findById(seat.getLoaiGheId())
                        .map(loaiGhe -> loaiGhe.getPhuThu() != null ? loaiGhe.getPhuThu() : BigDecimal.ZERO)
                        .orElse(BigDecimal.ZERO);
            }

            BigDecimal seatPrice = safe(showtime.getGiaVeCoBan()).add(surcharge);
            ticketTotal = ticketTotal.add(seatPrice);
            ticketPrices.add(seatPrice);
            seatNames.add(seat.getMaGhe());
        }

        BigDecimal serviceTotal = BigDecimal.ZERO;
        List<com.example.datvexemphim.dto.request.BookingRequest.ServiceItem> validatedServices = new ArrayList<>();
        if (request.getServices() != null) {
            for (var serviceItem : request.getServices()) {
                if (serviceItem.getSoLuong() == null || serviceItem.getSoLuong() <= 0) {
                    throw new BadRequestException("So luong dich vu phai lon hon 0");
                }

                var service = dichVuRepository.findById(serviceItem.getDichVuId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dich vu khong ton tai: " + serviceItem.getDichVuId()));
                if (service.getTrangThai() == null || service.getTrangThai() != ACTIVE_STATUS) {
                    throw new BadRequestException("Dich vu " + service.getTen() + " khong kha dung");
                }

                BigDecimal unitPrice = safe(service.getGiaBan());
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(serviceItem.getSoLuong()));
                serviceTotal = serviceTotal.add(lineTotal);
                validatedServices.add(BookingRequest.ServiceItem.builder()
                        .dichVuId(service.getId())
                        .soLuong(serviceItem.getSoLuong())
                        .donGia(unitPrice)
                        .build());
            }
        }

        BigDecimal subtotal = ticketTotal.add(serviceTotal);
        PromotionCalculation promotionCalculation = calculatePromotion(request.getKhuyenMaiId(), subtotal);
        PointsCalculation pointsCalculation = calculatePointsDiscount(customer, request.getDiemThuongSuDung(), subtotal.subtract(promotionCalculation.discount()));
        BigDecimal totalDiscount = promotionCalculation.discount().add(pointsCalculation.discount());
        BigDecimal payableTotal = subtotal.subtract(totalDiscount).max(BigDecimal.ZERO);

        HoaDon hd = new HoaDon();
        hd.setKhachHangId(customerId);
        hd.setKhuyenMaiId(promotionCalculation.promotion() != null ? promotionCalculation.promotion().getId() : null);
        hd.setMaHoaDon("HD" + System.currentTimeMillis());
        hd.setTongTienBanDau(subtotal);
        hd.setSoTienGiam(totalDiscount);
        hd.setTongTienThanhToan(payableTotal);
        hd.setDiemThuongSuDung(pointsCalculation.pointsUsed());
        hd.setDiemThuongNhanDuoc(calculateEarnedPoints(payableTotal));
        hd.setThoiGianTao(LocalDateTime.now());
        hd.setThoiGianHetHanGiuGhe(LocalDateTime.now().plusMinutes(resolveSeatHoldMinutes()));
        hd.setTrangThai(INVOICE_STATUS_PAID);
        hd = repository.save(hd);

        for (int index = 0; index < request.getGheNgoiIds().size(); index++) {
            UUID gheId = request.getGheNgoiIds().get(index);
            com.example.datvexemphim.entity.VeBan ve = new com.example.datvexemphim.entity.VeBan();
            ve.setSuatChieuId(request.getSuatChieuId());
            ve.setGheNgoiId(gheId);
            ve.setMaVe("VE" + System.currentTimeMillis() + gheId.toString().substring(0, 4));
            ve.setGiaVeThucTe(ticketPrices.get(index));
            ve.setTrangThai(TICKET_STATUS_BOOKED);
            try {
                ve = veBanRepository.saveAndFlush(ve);
            } catch (DataIntegrityViolationException ex) {
                throw new BadRequestException("Ghe da co nguoi dat, vui long chon ghe khac");
            }

            com.example.datvexemphim.entity.ChiTietHoaDonVe ctVe = new com.example.datvexemphim.entity.ChiTietHoaDonVe();
            ctVe.setHoaDonId(hd.getId());
            ctVe.setVeBanId(ve.getId());
            ctVe.setThanhTien(ticketPrices.get(index));
            chiTietVeRepository.save(ctVe);
        }

        for (var serviceItem : validatedServices) {
            com.example.datvexemphim.entity.ChiTietHoaDonDichVu ctDv = new com.example.datvexemphim.entity.ChiTietHoaDonDichVu();
            ctDv.setHoaDonId(hd.getId());
            ctDv.setDichVuId(serviceItem.getDichVuId());
            ctDv.setSoLuong(serviceItem.getSoLuong());
            ctDv.setDonGia(serviceItem.getDonGia());
            ctDv.setThanhTien(serviceItem.getDonGia().multiply(BigDecimal.valueOf(serviceItem.getSoLuong())));
            chiTietDichVuRepository.save(ctDv);
        }

        int updatedPoints = Math.max(0, safeInt(customer.getDiemTichLuy()) - pointsCalculation.pointsUsed()) + hd.getDiemThuongNhanDuoc();
        customer.setDiemTichLuy(updatedPoints);
        khachHangRepository.save(customer);

        if (promotionCalculation.promotion() != null && promotionCalculation.promotion().getSoLuong() != null && promotionCalculation.promotion().getSoLuong() > 0) {
            promotionCalculation.promotion().setSoLuong(promotionCalculation.promotion().getSoLuong() - 1);
            khuyenMaiRepository.save(promotionCalculation.promotion());
        }

        sendConfirmationEmail(hd, customer, showtime, seatNames);
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
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Not found: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void cancel(UUID id) {
        HoaDon hd = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found invoice: " + id));
        enforceCustomerOwnership(hd.getKhachHangId());

        hd.setTrangThai(INVOICE_STATUS_CANCELLED);
        repository.save(hd);

        List<ChiTietHoaDonVe> ctVes = chiTietVeRepository.findByHoaDonId(id);
        for (var ct : ctVes) {
            veBanRepository.findById(ct.getVeBanId()).ifPresent(ve -> {
                ve.setTrangThai(TICKET_STATUS_CANCELLED);
                veBanRepository.save(ve);
            });
        }

        if (hd.getDiemThuongSuDung() != null && hd.getDiemThuongSuDung() > 0) {
            khachHangRepository.findById(hd.getKhachHangId()).ifPresent(kh -> {
                int refundedPoints = safeInt(kh.getDiemTichLuy()) + hd.getDiemThuongSuDung() - safeInt(hd.getDiemThuongNhanDuoc());
                kh.setDiemTichLuy(Math.max(0, refundedPoints));
                khachHangRepository.save(kh);
            });
        }
    }

    private UUID resolveCheckoutCustomerId(BookingRequest request, AuthenticatedUser currentUser) {
        if ("CUSTOMER".equals(currentUser.getAccessScope())) {
            return currentUser.getUserId();
        }

        if (request.getKhachHangId() == null) {
            throw new BadRequestException("Khach hang khong hop le");
        }
        return request.getKhachHangId();
    }

    private PromotionCalculation calculatePromotion(UUID khuyenMaiId, BigDecimal subtotal) {
        if (khuyenMaiId == null) {
            return new PromotionCalculation(null, BigDecimal.ZERO);
        }

        KhuyenMai promotion = khuyenMaiRepository.findById(khuyenMaiId)
                .orElseThrow(() -> new ResourceNotFoundException("Khuyen mai khong ton tai"));

        LocalDateTime now = LocalDateTime.now();
        if (promotion.getTrangThai() == null || promotion.getTrangThai() != ACTIVE_STATUS) {
            throw new BadRequestException("Khuyen mai khong kha dung");
        }
        if (promotion.getSoLuong() != null && promotion.getSoLuong() <= 0) {
            throw new BadRequestException("Khuyen mai da het luot su dung");
        }
        if (promotion.getThoiGianBatDau() != null && now.isBefore(promotion.getThoiGianBatDau())) {
            throw new BadRequestException("Khuyen mai chua den thoi gian ap dung");
        }
        if (promotion.getThoiGianKetThuc() != null && now.isAfter(promotion.getThoiGianKetThuc())) {
            throw new BadRequestException("Khuyen mai da het han");
        }

        BigDecimal discount = subtotal.multiply(BigDecimal.valueOf(safeInt(promotion.getPhanTramGiam())))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        if (promotion.getGiamToiDa() != null) {
            discount = discount.min(promotion.getGiamToiDa());
        }

        return new PromotionCalculation(promotion, discount.max(BigDecimal.ZERO));
    }

    private PointsCalculation calculatePointsDiscount(KhachHang customer, Integer requestedPoints, BigDecimal maxDiscountableAmount) {
        int availablePoints = safeInt(customer.getDiemTichLuy());
        int pointsToUse = requestedPoints != null ? requestedPoints : 0;
        if (pointsToUse < 0) {
            throw new BadRequestException("So diem su dung khong hop le");
        }
        if (pointsToUse > availablePoints) {
            throw new BadRequestException("So diem su dung vuot qua diem hien co");
        }
        if (pointsToUse == 0) {
            return new PointsCalculation(0, BigDecimal.ZERO);
        }

        BigDecimal requestedDiscount = BigDecimal.valueOf(pointsToUse).multiply(POINT_VALUE);
        BigDecimal maxByPolicy = maxDiscountableAmount.multiply(MAX_POINTS_DISCOUNT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal actualDiscount = requestedDiscount.min(maxByPolicy).min(maxDiscountableAmount.max(BigDecimal.ZERO));
        int actualPointsUsed = actualDiscount.divide(POINT_VALUE, 0, RoundingMode.DOWN).intValue();

        return new PointsCalculation(actualPointsUsed, actualDiscount);
    }

    private int calculateEarnedPoints(BigDecimal payableTotal) {
        CaiDatChung settings = caiDatChungRepository.findAll().stream().findFirst().orElse(null);
        if (settings == null || settings.getTyLeTichDiem() == null || settings.getTyLeTichDiem() <= 0) {
            return 0;
        }
        return payableTotal.divide(BigDecimal.valueOf(settings.getTyLeTichDiem()), 0, RoundingMode.DOWN).intValue();
    }

    private int resolveSeatHoldMinutes() {
        return caiDatChungRepository.findAll().stream()
                .findFirst()
                .map(CaiDatChung::getThoiGianGiuGhe)
                .filter(minutes -> minutes != null && minutes > 0)
                .orElse(15);
    }

    private void sendConfirmationEmail(HoaDon invoice, KhachHang customer, SuatChieu showtime, List<String> seatNames) {
        try {
            String movieName = phimRepository.findById(showtime.getPhimId()).map(p -> p.getTen()).orElse("Phim");
            String roomName = phongChieuRepository.findById(showtime.getPhongChieuId()).map(pc -> pc.getTen()).orElse("Rap");
            emailService.sendBookingConfirmation(
                    invoice,
                    customer.getEmail(),
                    customer.getHoTen(),
                    movieName,
                    showtime.getThoiGianBatDau().toString(),
                    roomName,
                    String.join(", ", seatNames),
                    invoice.getTongTienThanhToan().toString()
            );
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private void enforceCustomerOwnership(UUID customerId) {
        AuthenticatedUser currentUser = getCurrentUser();
        if ("CUSTOMER".equals(currentUser.getAccessScope()) && !currentUser.getUserId().equals(customerId)) {
            throw new AccessDeniedException("Ban khong co quyen truy cap hoa don nay");
        }
    }

    private AuthenticatedUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser authenticatedUser)) {
            throw new AccessDeniedException("Ban chua dang nhap");
        }
        return authenticatedUser;
    }

    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private int safeInt(Integer value) {
        return value != null ? value : 0;
    }

    private record PromotionCalculation(KhuyenMai promotion, BigDecimal discount) {}

    private record PointsCalculation(int pointsUsed, BigDecimal discount) {}
}
