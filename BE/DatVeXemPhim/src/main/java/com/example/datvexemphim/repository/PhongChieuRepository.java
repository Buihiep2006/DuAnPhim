package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.PhongChieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PhongChieuRepository extends JpaRepository<PhongChieu, UUID> {
}
