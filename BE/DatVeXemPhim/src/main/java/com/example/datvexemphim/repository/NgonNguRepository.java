package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.NgonNgu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NgonNguRepository extends JpaRepository<NgonNgu, UUID> {
}
