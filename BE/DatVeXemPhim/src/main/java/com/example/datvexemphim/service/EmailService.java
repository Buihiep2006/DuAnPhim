package com.example.datvexemphim.service;

import com.example.datvexemphim.entity.HoaDon;
import com.example.datvexemphim.entity.KhachHang;

public interface EmailService {
    void sendBookingConfirmation(HoaDon hoaDon, String customerEmail, String customerName, String movieName, String showtime, String room, String seats, String total);
}
