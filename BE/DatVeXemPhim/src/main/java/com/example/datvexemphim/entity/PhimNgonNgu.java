package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "phim_ngon_ngu")
public class PhimNgonNgu {
    @EmbeddedId
    private PhimNgonNguId id;

    @MapsId("phimId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @MapsId("ngonNguId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ngon_ngu_id", nullable = false)
    private NgonNgu ngonNgu;

}