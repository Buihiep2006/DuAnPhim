package com.example.datvexemphim.repository;

import com.example.datvexemphim.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, UUID> {
    Optional<KhachHang> findByEmail(String email);
    Optional<KhachHang> findByAuthProviderAndProviderId(String authProvider, String providerId);
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, UUID id);
    boolean existsBySoDienThoai(String soDienThoai);
    boolean existsBySoDienThoaiAndIdNot(String soDienThoai, UUID id);
}
