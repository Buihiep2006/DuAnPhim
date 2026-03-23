package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.PhimDaoDien;
import com.example.datvexemphim.entity.PhimDaoDienId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhimDaoDienRepository extends JpaRepository<PhimDaoDien, PhimDaoDienId> {
    List<PhimDaoDien> findByPhimId(UUID phimId);
    void deleteByPhimId(UUID phimId);
}
