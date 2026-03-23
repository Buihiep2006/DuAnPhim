package com.example.datvexemphim.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Embeddable
public class PhimTheLoaiId implements Serializable {
    private static final long serialVersionUID = -5139430716157437834L;
    @NotNull
    @Column(name = "phim_id", nullable = false)
    private UUID phimId;

    @NotNull
    @Column(name = "the_loai_id", nullable = false)
    private UUID theLoaiId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PhimTheLoaiId entity = (PhimTheLoaiId) o;
        return Objects.equals(this.theLoaiId, entity.theLoaiId) &&
                Objects.equals(this.phimId, entity.phimId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(theLoaiId, phimId);
    }

}