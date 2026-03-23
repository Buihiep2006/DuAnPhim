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
public class PhimDienVienId implements Serializable {
    private static final long serialVersionUID = 4180628546480344409L;
    @NotNull
    @Column(name = "phim_id", nullable = false)
    private UUID phimId;

    @NotNull
    @Column(name = "dien_vien_id", nullable = false)
    private UUID dienVienId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PhimDienVienId entity = (PhimDienVienId) o;
        return Objects.equals(this.dienVienId, entity.dienVienId) &&
                Objects.equals(this.phimId, entity.phimId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dienVienId, phimId);
    }

}