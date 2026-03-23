package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.VeBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VeBanRepository extends JpaRepository<VeBan, UUID> {
}
