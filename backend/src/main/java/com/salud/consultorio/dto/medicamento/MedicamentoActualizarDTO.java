package com.salud.consultorio.dto.medicamento;

import com.salud.consultorio.model.enums.GrupoTerapeutico;
import com.salud.consultorio.model.enums.IndicacionTerapeutica;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MedicamentoActualizarDTO(

        @NotBlank(message = "El nombre del medicamento es obligatorio.")
        @Size(max = 150, message = "El nombre no puede superar los 150 caracteres.")
        String nombre,

        @Size(max = 150, message = "El principio activo no puede superar los 150 caracteres.")
        String principioActivo,

        @Size(max = 60, message = "La concentración no puede superar los 60 caracteres.")
        String concentracion,

        @NotNull(message = "El grupo terapéutico es obligatorio.")
        GrupoTerapeutico grupoTerapeutico,

        IndicacionTerapeutica indicacionTerapeutica,

        @Size(max = 100, message = "El laboratorio no puede superar los 100 caracteres.")
        String laboratorio,

        @Size(max = 255, message = "La descripción no puede superar los 255 caracteres.")
        String descripcion,

        @NotNull(message = "Indique si el medicamento requiere receta.")
        Boolean requiereReceta,

        /** true = quitar la imagen actual (si además se envía una imagen nueva, esta prevalece). */
        Boolean quitarImagen
) {
}