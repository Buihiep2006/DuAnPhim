package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.ChiTietHoaDonDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChiTietHoaDonDichVuRepository extends JpaRepository<ChiTietHoaDonDichVu, UUID> {
    java.util.List<ChiTietHoaDonDichVu> findByHoaDonId(java.util.UUID hoaDonId);
}
