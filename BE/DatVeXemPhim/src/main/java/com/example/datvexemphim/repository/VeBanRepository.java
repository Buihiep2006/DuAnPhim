package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.VeBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VeBanRepository extends JpaRepository<VeBan, UUID> {
    List<VeBan> findBySuatChieuId(UUID suatChieuId);
    boolean existsBySuatChieuIdAndGheNgoiIdAndTrangThaiNot(UUID suatChieuId, UUID gheNgoiId, Integer trangThai);
}
