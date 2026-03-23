package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "phim_dao_dien")
public class PhimDaoDien {
    @EmbeddedId
    private PhimDaoDienId id;

    @MapsId("phimId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @MapsId("daoDienId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "dao_dien_id", nullable = false)
    private DaoDien daoDien;

}