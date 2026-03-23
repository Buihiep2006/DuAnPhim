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
public class PhimDaoDienId implements Serializable {
    private static final long serialVersionUID = 389301415829411876L;
    @NotNull
    @Column(name = "phim_id", nullable = false)
    private UUID phimId;

    @NotNull
    @Column(name = "dao_dien_id", nullable = false)
    private UUID daoDienId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PhimDaoDienId entity = (PhimDaoDienId) o;
        return Objects.equals(this.daoDienId, entity.daoDienId) &&
                Objects.equals(this.phimId, entity.phimId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(daoDienId, phimId);
    }

}