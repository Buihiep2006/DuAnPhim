package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.CaiDatChungResponse;
import com.example.datvexemphim.dto.response.DichVuResponse;
import com.example.datvexemphim.dto.response.GheNgoiResponse;
import com.example.datvexemphim.dto.response.KhuyenMaiResponse;
import com.example.datvexemphim.dto.response.LoaiGheResponse;
import com.example.datvexemphim.dto.response.PhimResponse;
import com.example.datvexemphim.dto.response.RapChieuResponse;
import com.example.datvexemphim.dto.response.SuatChieuResponse;
import com.example.datvexemphim.dto.response.TheLoaiPhimResponse;
import com.example.datvexemphim.dto.response.VeBanResponse;
import com.example.datvexemphim.service.CaiDatChungService;
import com.example.datvexemphim.service.DichVuService;
import com.example.datvexemphim.service.GheNgoiService;
import com.example.datvexemphim.service.KhuyenMaiService;
import com.example.datvexemphim.service.LoaiGheService;
import com.example.datvexemphim.service.PhimService;
import com.example.datvexemphim.service.RapChieuService;
import com.example.datvexemphim.service.SuatChieuService;
import com.example.datvexemphim.service.TheLoaiPhimService;
import com.example.datvexemphim.service.VeBanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@CrossOrigin("*")
public class PublicCatalogController {

    @Autowired private PhimService phimService;
    @Autowired private TheLoaiPhimService theLoaiPhimService;
    @Autowired private RapChieuService rapChieuService;
    @Autowired private SuatChieuService suatChieuService;
    @Autowired private GheNgoiService gheNgoiService;
    @Autowired private VeBanService veBanService;
    @Autowired private LoaiGheService loaiGheService;
    @Autowired private CaiDatChungService caiDatChungService;
    @Autowired private DichVuService dichVuService;
    @Autowired private KhuyenMaiService khuyenMaiService;

    @GetMapping("/phim")
    public ResponseEntity<ApiResponse<List<PhimResponse>>> getMovies() {
        return ResponseEntity.ok(ApiResponse.success(phimService.getAll(), "Lay danh sach phim thanh cong"));
    }

    @GetMapping("/phim/{id}")
    public ResponseEntity<ApiResponse<PhimResponse>> getMovieById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(phimService.getById(id), "Lay phim thanh cong"));
    }

    @GetMapping("/the-loai")
    public ResponseEntity<ApiResponse<List<TheLoaiPhimResponse>>> getGenres() {
        return ResponseEntity.ok(ApiResponse.success(theLoaiPhimService.getAll(), "Lay danh sach the loai thanh cong"));
    }

    @GetMapping("/rap-chieu")
    public ResponseEntity<ApiResponse<List<RapChieuResponse>>> getCinemas() {
        return ResponseEntity.ok(ApiResponse.success(rapChieuService.getAll(), "Lay danh sach rap thanh cong"));
    }

    @GetMapping("/suat-chieu/{id}")
    public ResponseEntity<ApiResponse<SuatChieuResponse>> getShowtimeById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(suatChieuService.getById(id), "Lay suat chieu thanh cong"));
    }

    @GetMapping("/suat-chieu/phim/{phimId}")
    public ResponseEntity<ApiResponse<List<SuatChieuResponse>>> getShowtimesByMovie(@PathVariable UUID phimId) {
        return ResponseEntity.ok(ApiResponse.success(suatChieuService.getByPhimId(phimId), "Lay suat chieu theo phim thanh cong"));
    }

    @GetMapping("/ghe-ngoi/phong-chieu/{phongChieuId}")
    public ResponseEntity<ApiResponse<List<GheNgoiResponse>>> getSeatsByRoom(@PathVariable UUID phongChieuId) {
        return ResponseEntity.ok(ApiResponse.success(gheNgoiService.getByPhongChieuId(phongChieuId), "Lay ghe theo phong thanh cong"));
    }

    @GetMapping("/ve-ban/suat-chieu/{suatChieuId}")
    public ResponseEntity<ApiResponse<List<VeBanResponse>>> getTicketsByShowtime(@PathVariable UUID suatChieuId) {
        return ResponseEntity.ok(ApiResponse.success(veBanService.getBySuatChieuId(suatChieuId), "Lay ve theo suat chieu thanh cong"));
    }

    @GetMapping("/loai-ghe")
    public ResponseEntity<ApiResponse<List<LoaiGheResponse>>> getSeatTypes() {
        return ResponseEntity.ok(ApiResponse.success(loaiGheService.getAll(), "Lay loai ghe thanh cong"));
    }

    @GetMapping("/cai-dat-chung")
    public ResponseEntity<ApiResponse<List<CaiDatChungResponse>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(caiDatChungService.getAll(), "Lay cai dat chung thanh cong"));
    }

    @GetMapping("/dich-vu")
    public ResponseEntity<ApiResponse<List<DichVuResponse>>> getServices() {
        return ResponseEntity.ok(ApiResponse.success(dichVuService.getAll(), "Lay dich vu thanh cong"));
    }

    @GetMapping("/khuyen-mai")
    public ResponseEntity<ApiResponse<List<KhuyenMaiResponse>>> getPromotions() {
        return ResponseEntity.ok(ApiResponse.success(khuyenMaiService.getAll(), "Lay khuyen mai thanh cong"));
    }
}
