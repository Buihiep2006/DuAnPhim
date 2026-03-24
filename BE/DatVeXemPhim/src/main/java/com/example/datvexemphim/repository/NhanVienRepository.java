package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, UUID> {
    Optional<NhanVien> findByEmail(String email);
}
