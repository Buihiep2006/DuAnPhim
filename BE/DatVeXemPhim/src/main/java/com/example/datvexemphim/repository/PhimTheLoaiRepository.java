package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.PhimTheLoai;
import com.example.datvexemphim.entity.PhimTheLoaiId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhimTheLoaiRepository extends JpaRepository<PhimTheLoai, PhimTheLoaiId> {
    List<PhimTheLoai> findByPhimId(UUID phimId);
    void deleteByPhimId(UUID phimId);
}
