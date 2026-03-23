package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VaiTroRepository extends JpaRepository<VaiTro, UUID> {
}
