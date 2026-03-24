package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, UUID> {
    java.util.List<HoaDon> findByKhachHangIdOrderByThoiGianTaoDesc(java.util.UUID khachHangId);
}
