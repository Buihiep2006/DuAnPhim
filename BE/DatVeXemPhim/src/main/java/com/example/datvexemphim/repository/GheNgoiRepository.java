package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.GheNgoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GheNgoiRepository extends JpaRepository<GheNgoi, UUID> {
    List<GheNgoi> findByPhongChieuId(UUID phongChieuId);
}
