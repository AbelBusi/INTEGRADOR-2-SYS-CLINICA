package com.salud.consultorio.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IFirmaElectronicaServicio {

    FirmaElectronica firmar(DatosFirma datos);

    boolean verificar(DatosFirma datos, String firma);

    record DatosFirma(
            String codigoDocumento,
            String numero,
            Integer idCita,
            Integer idPaciente,
            String pacienteDocumento,
            Integer idMedico,
            String medicoNombre,
            String medicoColegiatura,
            String medicoEspecialidad,
            LocalDate fechaAtencion,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer dias,
            String justificacion,
            LocalDateTime fechaEmision,
            String metodoConfirmacion
    ) {
    }

    record FirmaElectronica(String tipo, String algoritmo, String firma, String hashContenido) {
    }
}