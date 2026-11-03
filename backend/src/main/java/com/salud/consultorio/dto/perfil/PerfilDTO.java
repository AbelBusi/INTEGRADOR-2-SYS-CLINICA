package com.salud.consultorio.dto.perfil;

import java.time.LocalDate;
import java.util.List;

public record PerfilDTO(
        String nombres,
        String apellidos,
        String tipoDocumento,
        String numeroDocumento,
        LocalDate fechaNacimiento,
        String genero,
        String nacionalidad,
        String telefono,
        String correo,
        String direccion,
        String usuario,
        Integer estado,
        List<RolPerfilDTO> roles,
        List<DatoPerfilDTO> datosAdicionales
) {

    public record RolPerfilDTO(Integer idRol, String nombre, String descripcion) {}

    public record DatoPerfilDTO(String etiqueta, String valor) {}
}