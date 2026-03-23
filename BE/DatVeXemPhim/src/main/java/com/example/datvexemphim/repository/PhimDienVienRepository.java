package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.PhimDienVien;
import com.example.datvexemphim.entity.PhimDienVienId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhimDienVienRepository extends JpaRepository<PhimDienVien, PhimDienVienId> {
    List<PhimDienVien> findByPhimId(UUID phimId);
    void deleteByPhimId(UUID phimId);
}
