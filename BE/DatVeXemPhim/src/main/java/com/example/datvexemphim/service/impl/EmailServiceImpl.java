package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.entity.HoaDon;
import com.example.datvexemphim.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendBookingConfirmation(HoaDon hoaDon, String customerEmail, String customerName, String movieName, String showtime, String room, String seats, String total) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("nguyenquochuy8606@gmail.com");
            helper.setTo(customerEmail);
            helper.setSubject("Xác nhận đặt vé thành công - " + hoaDon.getMaHoaDon());

            String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + hoaDon.getMaHoaDon();
            
            String htmlContent = String.format(
                "<html><body>" +
                "<h2>Chào %s,</h2>" +
                "<p>Cảm ơn bạn đã đặt vé tại hệ thống của chúng tôi. Dưới đây là thông tin vé của bạn:</p>" +
                "<div style='border: 1px solid #ddd; padding: 20px; max-width: 500px;'>" +
                "<h3>%s</h3>" +
                "<p><b>Mã hóa đơn:</b> %s</p>" +
                "<p><b>Thời gian:</b> %s</p>" +
                "<p><b>Rạp/Phòng:</b> %s</p>" +
                "<p><b>Ghế:</b> %s</p>" +
                "<p><b>Tổng tiền:</b> %sđ</p>" +
                "<hr/>" +
                "<p style='text-align: center;'><b>MÃ QR VÉ CỦA BẠN</b></p>" +
                "<div style='text-align: center;'><img src='%s' width='200' height='200'/></div>" +
                "</div>" +
                "<p>Vui lòng đưa mã QR này cho nhân viên tại quầy để nhận vé.</p>" +
                "</body></html>",
                customerName, movieName, hoaDon.getMaHoaDon(), showtime, room, seats, total, qrUrl
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            // Log error but don't block the transaction
        }
    }
}
