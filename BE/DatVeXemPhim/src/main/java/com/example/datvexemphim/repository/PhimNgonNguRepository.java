package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.PhimNgonNgu;
import com.example.datvexemphim.entity.PhimNgonNguId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhimNgonNguRepository extends JpaRepository<PhimNgonNgu, PhimNgonNguId> {
    List<PhimNgonNgu> findByPhimId(UUID phimId);
    void deleteByPhimId(UUID phimId);
}
