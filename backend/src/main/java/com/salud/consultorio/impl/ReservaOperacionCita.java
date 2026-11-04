package com.salud.consultorio.impl;

import com.salud.consultorio.auth.exception.OperacionBloqueadaException;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.enums.AccionHistorialCita;
import com.salud.consultorio.model.enums.OperacionCita;
import com.salud.consultorio.service.IHistorialCitaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ReservaOperacionCita {

    private final IHistorialCitaServicio historialCitaServicio;
    private final Clock clock;

    @Value("${consultorio.operacion.reserva-minutos:30}")
    private long minutosReserva;

    public void reservar(CitaMedica cita, OperacionCita operacion, Integer idUsuario, String intento) {
        exigirLibre(cita, idUsuario, intento);
        cita.setOperacionEnCurso(operacion);
        cita.setOperacionUsuario(idUsuario);
        cita.setOperacionExpira(LocalDateTime.now(clock).plusMinutes(minutosReserva));
    }

    public boolean esDe(CitaMedica cita, Integer idUsuario) {
        return vigente(cita) && Objects.equals(cita.getOperacionUsuario(), idUsuario);
    }

    public void exigirLibre(CitaMedica cita, Integer idUsuario, String intento) {

        if (!vigente(cita) || Objects.equals(cita.getOperacionUsuario(), idUsuario)) {
            return;
        }

        String mensaje = cita.getOperacionEnCurso() == OperacionCita.REGULARIZACION_MEDICA
                ? "La cita está siendo gestionada: el médico tiene una regularización clínica en curso."
                : "La cita está siendo gestionada: otro usuario tiene una regularización administrativa en curso.";

        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("operacion", intento);
        datos.put("operacionEnCurso", cita.getOperacionEnCurso().name());
        datos.put("estado", cita.getEstado());

        historialCitaServicio.registrar(cita, AccionHistorialCita.INTENTO_BLOQUEADO, null, datos, mensaje);

        throw new OperacionBloqueadaException(mensaje);

    }

    public void renovar(CitaMedica cita, Integer idUsuario) {

        if (cita.getOperacionEnCurso() == null || !Objects.equals(cita.getOperacionUsuario(), idUsuario)) {
            exigirLibre(cita, idUsuario, "RENOVAR_OPERACION");
            throw new IllegalArgumentException("No hay una operación en curso sobre esta cita.");
        }

        cita.setOperacionExpira(LocalDateTime.now(clock).plusMinutes(minutosReserva));

    }

    public void liberar(CitaMedica cita, Integer idUsuario) {
        if (Objects.equals(cita.getOperacionUsuario(), idUsuario)) {
            limpiar(cita);
        }
    }

    public void limpiar(CitaMedica cita) {
        cita.setOperacionEnCurso(null);
        cita.setOperacionUsuario(null);
        cita.setOperacionExpira(null);
    }

    private boolean vigente(CitaMedica cita) {
        return cita.getOperacionEnCurso() != null
                && cita.getOperacionExpira() != null
                && cita.getOperacionExpira().isAfter(LocalDateTime.now(clock));
    }

}