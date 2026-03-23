package com.example.datvexemphim.service.impl;

import com.example.datvexemphim.dto.request.TheLoaiPhimRequest;
import com.example.datvexemphim.dto.response.TheLoaiPhimResponse;
import com.example.datvexemphim.entity.TheLoaiPhim;
import com.example.datvexemphim.exception.ResourceNotFoundException;
import com.example.datvexemphim.repository.TheLoaiPhimRepository;
import com.example.datvexemphim.service.TheLoaiPhimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TheLoaiPhimServiceImpl implements TheLoaiPhimService {

    @Autowired
    private TheLoaiPhimRepository theLoaiPhimRepository;

    private TheLoaiPhimResponse mapToResponse(TheLoaiPhim theLoaiPhim) {
        return TheLoaiPhimResponse.builder()
                .id(theLoaiPhim.getId())
                .ma(theLoaiPhim.getMa())
                .ten(theLoaiPhim.getTen())
                .build();
    }

    @Override
    public List<TheLoaiPhimResponse> getAll() {
        return theLoaiPhimRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TheLoaiPhimResponse getById(UUID id) {
        TheLoaiPhim theLoaiPhim = theLoaiPhimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thể loại phim với id: " + id));
        return mapToResponse(theLoaiPhim);
    }

    @Override
    public TheLoaiPhimResponse create(TheLoaiPhimRequest request) {
        TheLoaiPhim theLoaiPhim = new TheLoaiPhim();
        theLoaiPhim.setMa(request.getMa() != null && !request.getMa().isEmpty() ? request.getMa() : "TL_" + System.currentTimeMillis());
        theLoaiPhim.setTen(request.getTen());
        return mapToResponse(theLoaiPhimRepository.save(theLoaiPhim));
    }

    @Override
    public TheLoaiPhimResponse update(UUID id, TheLoaiPhimRequest request) {
        TheLoaiPhim theLoaiPhim = theLoaiPhimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thể loại phim với id: " + id));
        if (request.getMa() != null && !request.getMa().isEmpty()) {
            theLoaiPhim.setMa(request.getMa());
        }
        theLoaiPhim.setTen(request.getTen());
        return mapToResponse(theLoaiPhimRepository.save(theLoaiPhim));
    }

    @Override
    public void delete(UUID id) {
        if (!theLoaiPhimRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy thể loại phim với id: " + id);
        }
        theLoaiPhimRepository.deleteById(id);
    }
}
