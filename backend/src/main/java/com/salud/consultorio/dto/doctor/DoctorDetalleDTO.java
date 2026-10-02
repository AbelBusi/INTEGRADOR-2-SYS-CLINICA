package com.salud.consultorio.dto.doctor;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "Detalle completo de un doctor, con datos de su empleado, persona y cargo")
public record DoctorDetalleDTO(

        @Schema(description = "ID del doctor", example = "1")
        Integer id,

        // ---------- Persona ----------
        @Schema(description = "ID del tipo de documento", example = "1")
        Integer idTipoDocumento,

        @Schema(description = "Código del tipo de documento", example = "DNI")
        String codigoTipoDocumento,

        @Schema(description = "Descripción del tipo de documento", example = "Documento Nacional de Identidad")
        String descripcionTipoDocumento,

        @Schema(description = "Número de documento", example = "72345678")
        String numeroDocumento,

        @Schema(description = "Nombres", example = "Carlos")
        String nombre,

        @Schema(description = "Apellidos", example = "Ramírez Torres")
        String apellidos,

        @Schema(description = "Fecha de nacimiento", example = "1990-05-14")
        LocalDate fechaNacimiento,

        @Schema(description = "Género", example = "Masculino")
        String genero,

        @Schema(description = "Teléfono", example = "987654321")
        String telefono,

        @Schema(description = "Dirección", example = "Av. Arequipa 1234, Lima")
        String direccion,

        @Schema(description = "Correo", example = "carlos.ramirez@clinica.com")
        String correo,

        @Schema(description = "Nacionalidad", example = "Peruana")
        String nacionalidad,

        // ---------- Empleado ----------
        @Schema(description = "ID del empleado", example = "1")
        Integer idEmpleado,

        @Schema(description = "ID del cargo", example = "1")
        Integer idCargo,

        @Schema(description = "Nombre del cargo", example = "Médico")
        String cargo,

        @Schema(description = "Fecha de ingreso", example = "2024-01-15")
        LocalDate fechaIngreso,

        @Schema(description = "Fecha de retiro", example = "null", nullable = true)
        LocalDate fechaRetiro,

        @Schema(description = "Foto del empleado", example = "https://midominio.com/fotos/carlos.jpg")
        String foto,

        @Schema(description = "Estado del empleado: 1 activo, 2 inactivo", example = "1")
        Integer estadoEmpleado,

        // ---------- Doctor ----------
        @Schema(description = "ID de la especialidad", example = "2")
        Integer idEspecialidad,

        @Schema(description = "Nombre de la especialidad", example = "Cardiología")
        String especialidad,

        @Schema(description = "Número de colegiatura", example = "045678")
        String numeroColegiatura,

        @Schema(description = "Número de especialidad", example = "RNE-12345")
        String numeroEspecialidad,

        @Schema(description = "Consejo regional", example = "CR Lima")
        String consejoRegional,

        @Schema(description = "Estado del doctor: 1 activo, 2 inactivo", example = "1")
        Integer estado

) {
}