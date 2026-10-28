package com.salud.consultorio.configuration;

import com.salud.consultorio.service.ICitaMedicaServicio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CancelacionAutomaticaCitasScheduler {

    private final ICitaMedicaServicio citaMedicaServicio;

    @Scheduled(
            cron = "${app.citas.cancelacion-automatica.cron:0 */15 * * * *}",
            zone = "${app.zona-horaria:}"
    )
    public void ejecutar() {

        List<Integer> ids = citaMedicaServicio.idsVencidasParaCancelacionAutomatica();

        for (Integer id : ids) {
            try {
                citaMedicaServicio.cancelarAutomaticamentePorVencimiento(id);
            } catch (Exception e) {
                log.error("No se pudo cancelar automáticamente la cita {}", id, e);
            }
        }

    }

}