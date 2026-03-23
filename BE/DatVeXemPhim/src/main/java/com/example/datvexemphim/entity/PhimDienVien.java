package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "phim_dien_vien")
public class PhimDienVien {
    @EmbeddedId
    private PhimDienVienId id;

    @MapsId("phimId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @MapsId("dienVienId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "dien_vien_id", nullable = false)
    private DienVien dienVien;

}