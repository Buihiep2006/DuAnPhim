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
public class PhimNgonNguId implements Serializable {
    private static final long serialVersionUID = -372856406543576950L;
    @NotNull
    @Column(name = "phim_id", nullable = false)
    private UUID phimId;

    @NotNull
    @Column(name = "ngon_ngu_id", nullable = false)
    private UUID ngonNguId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PhimNgonNguId entity = (PhimNgonNguId) o;
        return Objects.equals(this.ngonNguId, entity.ngonNguId) &&
                Objects.equals(this.phimId, entity.phimId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ngonNguId, phimId);
    }

}