package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.HoaDonRequest;
import com.example.datvexemphim.dto.response.HoaDonResponse;

import java.util.List;
import java.util.UUID;

public interface HoaDonService {
    List<HoaDonResponse> getAll();
    HoaDonResponse getById(UUID id);
    HoaDonResponse create(HoaDonRequest request);
    HoaDonResponse update(UUID id, HoaDonRequest request);
    void delete(UUID id);
    HoaDonResponse checkout(com.example.datvexemphim.dto.request.BookingRequest request);
    java.util.List<com.example.datvexemphim.dto.response.BookingHistoryResponse> getBookingHistory(UUID khachHangId);
    void cancel(UUID id);
}
