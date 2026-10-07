package com.salud.consultorio.dto.usuario;

public record UsuarioCreadoDTO(
        Integer id,
        String usuario,
        String correoEnmascarado
) {}