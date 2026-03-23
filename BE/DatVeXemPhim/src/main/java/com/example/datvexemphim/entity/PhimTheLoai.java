package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "phim_the_loai")
public class PhimTheLoai {
    @EmbeddedId
    private PhimTheLoaiId id;

    @MapsId("phimId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @MapsId("theLoaiId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "the_loai_id", nullable = false)
    private com.example.datvexemphim.entity.TheLoaiPhim theLoai;

}