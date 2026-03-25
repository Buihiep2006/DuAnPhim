package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.SuatChieu;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuatChieuRepository extends JpaRepository<SuatChieu, UUID> {
    List<SuatChieu> findByPhimId(UUID phimId);
    List<SuatChieu> findByPhongChieuIdAndThoiGianBatDauBetween(UUID phongChieuId, java.time.LocalDateTime start, java.time.LocalDateTime end);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select sc from SuatChieu sc where sc.id = :id")
    Optional<SuatChieu> findByIdForUpdate(@Param("id") UUID id);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT pc.rapChieuId FROM SuatChieu sc, PhongChieu pc WHERE sc.phongChieuId = pc.id AND sc.phimId = :phimId")
    List<UUID> findDistinctRapChieuIdsByPhimId(@org.springframework.data.repository.query.Param("phimId") UUID phimId);
}
