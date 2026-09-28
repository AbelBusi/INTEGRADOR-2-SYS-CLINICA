package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder(toBuilder = true)
@Table(name = "token")
public class Token {

    public enum TokenType{
        BEARER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "token",unique = true, columnDefinition = "TEXT")
    public String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type")
    public TokenType tokenType=TokenType.BEARER;

    @Column(name = "revoked")
    public boolean revoked;

    @Column(name = "expired")
    public boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    public Usuario usuario;

}