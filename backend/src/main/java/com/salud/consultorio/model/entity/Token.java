package com.salud.consultorio.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder(toBuilder = true)
@Table(name = "token_acceso")
public class Token {

    public enum TokenType{
        BEARER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_token_acceso")
    public Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    public Usuario usuario;

    @Column(name = "token",unique = true, columnDefinition = "TEXT")
    public String token;

    @Column(name = "expired")
    public boolean expired;

    @Column(name = "revoked")
    public boolean revoked;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type")
    public TokenType tokenType=TokenType.BEARER;

}