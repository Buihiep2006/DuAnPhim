package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.ChiTietHoaDonVe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChiTietHoaDonVeRepository extends JpaRepository<ChiTietHoaDonVe, UUID> {
    java.util.List<ChiTietHoaDonVe> findByHoaDonId(java.util.UUID hoaDonId);
}
