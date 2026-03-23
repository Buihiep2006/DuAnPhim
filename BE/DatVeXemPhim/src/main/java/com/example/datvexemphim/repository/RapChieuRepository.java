package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.RapChieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RapChieuRepository extends JpaRepository<RapChieu, UUID> {
}
