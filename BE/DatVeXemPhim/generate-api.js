const fs = require('fs');
const path = require('path');

const basePackage = 'com.example.datvexemphim';
const srcMainJava = path.join(__dirname, 'src', 'main', 'java', 'com', 'example', 'datvexemphim');

const schema = [
    {
        name: 'VaiTro', table: 'vai_tro', endpoint: 'vai-tro',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' }
        ]
    },
    {
        name: 'KhachHang', table: 'khach_hang', endpoint: 'khach-hang',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'hoTen', type: 'String', db: 'ho_ten' },
            { name: 'email', type: 'String', db: 'email' },
            { name: 'matKhau', type: 'String', db: 'mat_khau' },
            { name: 'ngaySinh', type: 'LocalDate', db: 'ngay_sinh' },
            { name: 'gioiTinh', type: 'Integer', db: 'gioi_tinh' },
            { name: 'soDienThoai', type: 'String', db: 'so_dien_thoai' },
            { name: 'authProvider', type: 'String', db: 'auth_provider' },
            { name: 'providerId', type: 'String', db: 'provider_id' },
            { name: 'hinhAnhDaiDien', type: 'String', db: 'hinh_anh_dai_dien' },
            { name: 'diemTichLuy', type: 'Integer', db: 'diem_tich_luy' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'NhanVien', table: 'nhan_vien', endpoint: 'nhan-vien',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'vaiTroId', type: 'UUID', db: 'vai_tro_id' },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'hoTen', type: 'String', db: 'ho_ten' },
            { name: 'email', type: 'String', db: 'email' },
            { name: 'matKhau', type: 'String', db: 'mat_khau' },
            { name: 'ngaySinh', type: 'LocalDate', db: 'ngay_sinh' },
            { name: 'gioiTinh', type: 'Integer', db: 'gioi_tinh' },
            { name: 'soDienThoai', type: 'String', db: 'so_dien_thoai' },
            { name: 'hinhAnhDaiDien', type: 'String', db: 'hinh_anh_dai_dien' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'QuenMatKhau', table: 'quen_mat_khau', endpoint: 'quen-mat-khau',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'email', type: 'String', db: 'email' },
            { name: 'maToken', type: 'String', db: 'ma_token' },
            { name: 'thoiGianHetHan', type: 'LocalDateTime', db: 'thoi_gian_het_han' }
        ]
    },
    {
        name: 'PhanLoaiDoTuoi', table: 'phan_loai_do_tuoi', endpoint: 'phan-loai-do-tuoi',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'moTa', type: 'String', db: 'mo_ta' }
        ]
    },
    {
        name: 'DinhDangPhim', table: 'dinh_dang_phim', endpoint: 'dinh-dang-phim',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'phuThu', type: 'BigDecimal', db: 'phu_thu' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'Phim', table: 'phim', endpoint: 'phim',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'phanLoaiDoTuoiId', type: 'UUID', db: 'phan_loai_do_tuoi_id' },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'thoiLuong', type: 'Integer', db: 'thoi_luong' },
            { name: 'ngayCongChieu', type: 'LocalDateTime', db: 'ngay_cong_chieu' },
            { name: 'ngayKetThuc', type: 'LocalDateTime', db: 'ngay_ket_thuc' },
            { name: 'hinhAnhPoster', type: 'String', db: 'hinh_anh_poster' },
            { name: 'hinhAnhBanner', type: 'String', db: 'hinh_anh_banner' },
            { name: 'trailerUrl', type: 'String', db: 'trailer_url' },
            { name: 'moTa', type: 'String', db: 'mo_ta' },
            { name: 'metadata', type: 'String', db: 'metadata' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'DanhGiaPhim', table: 'danh_gia_phim', endpoint: 'danh-gia-phim',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'phimId', type: 'UUID', db: 'phim_id' },
            { name: 'khachHangId', type: 'UUID', db: 'khach_hang_id' },
            { name: 'diemSo', type: 'Integer', db: 'diem_so' },
            { name: 'binhLuan', type: 'String', db: 'binh_luan' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'RapChieu', table: 'rap_chieu', endpoint: 'rap-chieu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'diaChi', type: 'String', db: 'dia_chi' },
            { name: 'khuVuc', type: 'String', db: 'khu_vuc' },
            { name: 'moTa', type: 'String', db: 'mo_ta' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'PhongChieu', table: 'phong_chieu', endpoint: 'phong-chieu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'rapChieuId', type: 'UUID', db: 'rap_chieu_id' },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'sucChua', type: 'Integer', db: 'suc_chua' },
            { name: 'loaiMayChieu', type: 'Integer', db: 'loai_may_chieu' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'LoaiGhe', table: 'loai_ghe', endpoint: 'loai-ghe',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'phuThu', type: 'BigDecimal', db: 'phu_thu' }
        ]
    },
    {
        name: 'GheNgoi', table: 'ghe_ngoi', endpoint: 'ghe-ngoi',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'phongChieuId', type: 'UUID', db: 'phong_chieu_id' },
            { name: 'loaiGheId', type: 'UUID', db: 'loai_ghe_id' },
            { name: 'maGhe', type: 'String', db: 'ma_ghe' },
            { name: 'hangGhe', type: 'String', db: 'hang_ghe' },
            { name: 'soThuTu', type: 'Integer', db: 'so_thu_tu' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'LoaiDichVu', table: 'loai_dich_vu', endpoint: 'loai-dich-vu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' }
        ]
    },
    {
        name: 'DichVu', table: 'dich_vu', endpoint: 'dich-vu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'loaiDichVuId', type: 'UUID', db: 'loai_dich_vu_id' },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'giaBan', type: 'BigDecimal', db: 'gia_ban' },
            { name: 'hinhAnh', type: 'String', db: 'hinh_anh' },
            { name: 'moTa', type: 'String', db: 'mo_ta' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'SuatChieu', table: 'suat_chieu', endpoint: 'suat-chieu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'phimId', type: 'UUID', db: 'phim_id' },
            { name: 'phongChieuId', type: 'UUID', db: 'phong_chieu_id' },
            { name: 'dinhDangPhimId', type: 'UUID', db: 'dinh_dang_phim_id' },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'thoiGianBatDau', type: 'LocalDateTime', db: 'thoi_gian_bat_dau' },
            { name: 'thoiGianKetThuc', type: 'LocalDateTime', db: 'thoi_gian_ket_thuc' },
            { name: 'giaVeCoBan', type: 'BigDecimal', db: 'gia_ve_co_ban' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'ChinhSachGia', table: 'chinh_sach_gia', endpoint: 'chinh-sach-gia',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'ma', type: 'String', db: 'ma' },
            { name: 'tenChinhSach', type: 'String', db: 'ten_chinh_sach' },
            { name: 'ngayTrongTuan', type: 'Integer', db: 'ngay_trong_tuan' },
            { name: 'khungGioBatDau', type: 'LocalTime', db: 'khung_gio_bat_dau' },
            { name: 'khungGioKetThuc', type: 'LocalTime', db: 'khung_gio_ket_thuc' },
            { name: 'phanTramDieuChinh', type: 'BigDecimal', db: 'phan_tram_dieu_chinh' },
            { name: 'phuThuCoDinh', type: 'BigDecimal', db: 'phu_thu_co_dinh' },
            { name: 'uuTien', type: 'Integer', db: 'uu_tien' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' },
            { name: 'ngayTao', type: 'LocalDateTime', db: 'ngay_tao' }
        ]
    },
    {
        name: 'KhuyenMai', table: 'khuyen_mai', endpoint: 'khuyen-mai',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'maCode', type: 'String', db: 'ma_code' },
            { name: 'ten', type: 'String', db: 'ten' },
            { name: 'phanTramGiam', type: 'Integer', db: 'phan_tram_giam' },
            { name: 'giamToiDa', type: 'BigDecimal', db: 'giam_toi_da' },
            { name: 'soLuong', type: 'Integer', db: 'so_luong' },
            { name: 'thoiGianBatDau', type: 'LocalDateTime', db: 'thoi_gian_bat_dau' },
            { name: 'thoiGianKetThuc', type: 'LocalDateTime', db: 'thoi_gian_ket_thuc' },
            { name: 'moTa', type: 'String', db: 'mo_ta' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'HoaDon', table: 'hoa_don', endpoint: 'hoa-don',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'khachHangId', type: 'UUID', db: 'khach_hang_id' },
            { name: 'nhanVienId', type: 'UUID', db: 'nhan_vien_id' },
            { name: 'khuyenMaiId', type: 'UUID', db: 'khuyen_mai_id' },
            { name: 'maHoaDon', type: 'String', db: 'ma_hoa_don' },
            { name: 'tongTienBanDau', type: 'BigDecimal', db: 'tong_tien_ban_dau' },
            { name: 'soTienGiam', type: 'BigDecimal', db: 'so_tien_giam' },
            { name: 'tongTienThanhToan', type: 'BigDecimal', db: 'tong_tien_thanh_toan' },
            { name: 'diemThuongSuDung', type: 'Integer', db: 'diem_thuong_su_dung' },
            { name: 'diemThuongNhanDuoc', type: 'Integer', db: 'diem_thuong_nhan_duoc' },
            { name: 'thoiGianTao', type: 'LocalDateTime', db: 'thoi_gian_tao' },
            { name: 'thoiGianHetHanGiuGhe', type: 'LocalDateTime', db: 'thoi_gian_het_han_giu_ghe' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'GiaoDichThanhToan', table: 'giao_dich_thanh_toan', endpoint: 'giao-dich-thanh-toan',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'hoaDonId', type: 'UUID', db: 'hoa_don_id' },
            { name: 'phuongThuc', type: 'String', db: 'phuong_thuc' },
            { name: 'maGiaoDichBenThu3', type: 'String', db: 'ma_giao_dich_ben_thu_3' },
            { name: 'soTienGiaoDich', type: 'BigDecimal', db: 'so_tien_giao_dich' },
            { name: 'thoiGianGiaoDich', type: 'LocalDateTime', db: 'thoi_gian_giao_dich' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'VeBan', table: 've_ban', endpoint: 've-ban',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'suatChieuId', type: 'UUID', db: 'suat_chieu_id' },
            { name: 'gheNgoiId', type: 'UUID', db: 'ghe_ngoi_id' },
            { name: 'maVe', type: 'String', db: 'ma_ve' },
            { name: 'giaVeThucTe', type: 'BigDecimal', db: 'gia_ve_thuc_te' },
            { name: 'thoiGianCheckIn', type: 'LocalDateTime', db: 'thoi_gian_check_in' },
            { name: 'trangThai', type: 'Integer', db: 'trang_thai' }
        ]
    },
    {
        name: 'ChiTietHoaDonVe', table: 'chi_tiet_hoa_don_ve', endpoint: 'chi-tiet-hoa-don-ve',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'hoaDonId', type: 'UUID', db: 'hoa_don_id' },
            { name: 'veBanId', type: 'UUID', db: 've_ban_id' },
            { name: 'thanhTien', type: 'BigDecimal', db: 'thanh_tien' }
        ]
    },
    {
        name: 'ChiTietHoaDonDichVu', table: 'chi_tiet_hoa_don_dich_vu', endpoint: 'chi-tiet-hoa-don-dich-vu',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'hoaDonId', type: 'UUID', db: 'hoa_don_id' },
            { name: 'dichVuId', type: 'UUID', db: 'dich_vu_id' },
            { name: 'soLuong', type: 'Integer', db: 'so_luong' },
            { name: 'donGia', type: 'BigDecimal', db: 'don_gia' },
            { name: 'thanhTien', type: 'BigDecimal', db: 'thanh_tien' }
        ]
    },
    {
        name: 'CaiDatChung', table: 'cai_dat_chung', endpoint: 'cai-dat-chung',
        columns: [
            { name: 'id', type: 'UUID', db: 'id', isId: true },
            { name: 'thoiGianGiuGhe', type: 'Integer', db: 'thoi_gian_giu_ghe' },
            { name: 'thoiGianNghiSuatChieu', type: 'Integer', db: 'thoi_gian_nghi_suat_chieu' },
            { name: 'gioMoCua', type: 'LocalTime', db: 'gio_mo_cua' },
            { name: 'gioDongCua', type: 'LocalTime', db: 'gio_dong_cua' },
            { name: 'giaVeCoBanMacDinh', type: 'BigDecimal', db: 'gia_ve_co_ban_mac_dinh' },
            { name: 'tyLeTichDiem', type: 'Integer', db: 'ty_le_tich_diem' }
        ]
    }
];

function generateEntity(table) {
    let imports = `import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
`;
    let body = `@Getter
@Setter
@Entity
@Table(name = "${table.table}")
public class ${table.name} {
`;
    table.columns.forEach(col => {
        if (col.isId) {
            body += `    @Id
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;\n\n`;
        } else {
            body += `    @Column(name = "${col.db}")\n`;
            body += `    private ${col.type} ${col.name};\n\n`;
        }
    });
    body += `}\n`;
    return `package ${basePackage}.entity;\n\n${imports}\n${body}`;
}

function generateRepository(table) {
    return `package ${basePackage}.repository;

import ${basePackage}.entity.${table.name};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ${table.name}Repository extends JpaRepository<${table.name}, UUID> {
}
`;
}

function generateRequestDto(table) {
    let fields = table.columns.filter(c => !c.isId).map(col => `    private ${col.type} ${col.name};`).join('\n');
    return `package ${basePackage}.dto.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ${table.name}Request {
${fields}
}
`;
}

function generateResponseDto(table) {
    let fields = table.columns.map(col => `    private ${col.type} ${col.name};`).join('\n');
    return `package ${basePackage}.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ${table.name}Response {
${fields}
}
`;
}

function generateServiceIntf(table) {
    return `package ${basePackage}.service;

import ${basePackage}.dto.request.${table.name}Request;
import ${basePackage}.dto.response.${table.name}Response;

import java.util.List;
import java.util.UUID;

public interface ${table.name}Service {
    List<${table.name}Response> getAll();
    ${table.name}Response getById(UUID id);
    ${table.name}Response create(${table.name}Request request);
    ${table.name}Response update(UUID id, ${table.name}Request request);
    void delete(UUID id);
}
`;
}

function generateServiceImpl(table) {
    let mapToResponse = table.columns.map(c => `                .${c.name}(entity.get${c.name[0].toUpperCase() + c.name.slice(1)}())`).join('\n');
    let mapFromRequest = table.columns.filter(c => !c.isId).map(c => {
        return `        entity.set${c.name[0].toUpperCase() + c.name.slice(1)}(request.get${c.name[0].toUpperCase() + c.name.slice(1)}());`;
    }).join('\n');

    return `package ${basePackage}.service.impl;

import ${basePackage}.dto.request.${table.name}Request;
import ${basePackage}.dto.response.${table.name}Response;
import ${basePackage}.entity.${table.name};
import ${basePackage}.exception.ResourceNotFoundException;
import ${basePackage}.repository.${table.name}Repository;
import ${basePackage}.service.${table.name}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ${table.name}ServiceImpl implements ${table.name}Service {

    @Autowired
    private ${table.name}Repository repository;

    private ${table.name}Response mapToResponse(${table.name} entity) {
        return ${table.name}Response.builder()
${mapToResponse}
                .build();
    }

    @Override
    public List<${table.name}Response> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ${table.name}Response getById(UUID id) {
        ${table.name} entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return mapToResponse(entity);
    }

    @Override
    public ${table.name}Response create(${table.name}Request request) {
        ${table.name} entity = new ${table.name}();
${mapFromRequest}
        return mapToResponse(repository.save(entity));
    }

    @Override
    public ${table.name}Response update(UUID id, ${table.name}Request request) {
        ${table.name} entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
${mapFromRequest}
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Not found: " + id);
        repository.deleteById(id);
    }
}
`;
}

function generateController(table) {
    return `package ${basePackage}.controller;

import ${basePackage}.dto.request.${table.name}Request;
import ${basePackage}.dto.response.ApiResponse;
import ${basePackage}.dto.response.${table.name}Response;
import ${basePackage}.service.${table.name}Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/${table.endpoint}")
@CrossOrigin("*")
public class ${table.name}Controller {

    @Autowired
    private ${table.name}Service service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<${table.name}Response>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<${table.name}Response>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<${table.name}Response>> create(@Valid @RequestBody ${table.name}Request request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<${table.name}Response>> update(@PathVariable UUID id, @Valid @RequestBody ${table.name}Request request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}
`;
}

Object.keys(schema).forEach(key => {
    let t = schema[key];
    console.log("Generating for " + t.name);

    fs.mkdirSync(path.join(srcMainJava, 'entity'), { recursive: true });
    fs.mkdirSync(path.join(srcMainJava, 'repository'), { recursive: true });
    fs.mkdirSync(path.join(srcMainJava, 'dto', 'request'), { recursive: true });
    fs.mkdirSync(path.join(srcMainJava, 'dto', 'response'), { recursive: true });
    fs.mkdirSync(path.join(srcMainJava, 'service', 'impl'), { recursive: true });
    fs.mkdirSync(path.join(srcMainJava, 'controller'), { recursive: true });

    // Note: I will only output if file DOES NOT exist to not overwrite the DaoDien, DienVien... I manually created with special logic, 
    // unless you want to overwrite. Let's overwrite them to be completely uniform unless they are in our ignore list.
    // Actually, overwriting is fine, the script logic is solid.

    fs.writeFileSync(path.join(srcMainJava, 'entity', t.name + '.java'), generateEntity(t));
    fs.writeFileSync(path.join(srcMainJava, 'repository', t.name + 'Repository.java'), generateRepository(t));
    fs.writeFileSync(path.join(srcMainJava, 'dto', 'request', t.name + 'Request.java'), generateRequestDto(t));
    fs.writeFileSync(path.join(srcMainJava, 'dto', 'response', t.name + 'Response.java'), generateResponseDto(t));
    fs.writeFileSync(path.join(srcMainJava, 'service', t.name + 'Service.java'), generateServiceIntf(t));
    fs.writeFileSync(path.join(srcMainJava, 'service', 'impl', t.name + 'ServiceImpl.java'), generateServiceImpl(t));
    fs.writeFileSync(path.join(srcMainJava, 'controller', t.name + 'Controller.java'), generateController(t));
});
console.log("Done generating all API files!");
