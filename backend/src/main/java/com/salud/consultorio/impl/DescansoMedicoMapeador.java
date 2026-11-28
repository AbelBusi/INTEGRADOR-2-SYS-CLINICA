package com.salud.consultorio.impl;
import com.salud.consultorio.util.DescansoMedicoReglas;

import java.time.Duration;
import java.time.LocalDateTime;
import com.salud.consultorio.dto.descansoMedico.CancelacionDescansoMedicoDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoDatosBaseDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoRespuestaDTO;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.repository.ICancelacionDescansoMedicoRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DescansoMedicoMapeador {

    private final ICancelacionDescansoMedicoRepositorio cancelacionRepositorio;

    /** Datos automáticos tomados de la atención (para el formulario). */
    public DescansoMedicoDatosBaseDTO datosBase(CitaMedica cita) {
        Persona paciente = cita.getPaciente().getPersona();
        Medico medico = cita.getMedico();
        return new DescansoMedicoDatosBaseDTO(
                nombreCompleto(paciente),
                documento(paciente),
                nombreCompleto(medico.getEmpleado().getPersona()),
                medico.getEspecialidad().getNombre(),
                medico.getNumeroColegiatura(),
                cita.getFechaCita());
    }

    public DescansoMedicoRespuestaDTO respuesta(DescansoMedico d) {
        return respuesta(d, cancelacionRepositorio.findByDescansoMedico_Id(d.getId()).orElse(null));
    }

    /** Una sola consulta de cancelaciones para toda la lista. */
    public List<DescansoMedicoRespuestaDTO> respuestas(List<DescansoMedico> lista) {
        if (lista.isEmpty()) {
            return List.of();
        }

        Map<Integer, CancelacionDescansoMedico> porDescanso = cancelacionRepositorio
                .findByDescansoMedico_IdIn(lista.stream().map(DescansoMedico::getId).toList())
                .stream()
                .collect(Collectors.toMap(c -> c.getDescansoMedico().getId(), Function.identity()));

        return lista.stream().map(d -> respuesta(d, porDescanso.get(d.getId()))).toList();
    }

    /** Respuesta construida solo con lo que quedó firmado y guardado, más el estado de cancelación. */
    public DescansoMedicoRespuestaDTO respuesta(DescansoMedico d, CancelacionDescansoMedico c) {
        return new DescansoMedicoRespuestaDTO(
                d.getId(),
                d.getCitaMedica().getId(),
                c == null ? "VIGENTE" : "CANCELADO",
                d.getNumero(),
                d.getCodigoDocumento(),
                new DescansoMedicoDatosBaseDTO(
                        d.getPacienteNombre(),
                        d.getPacienteDocumento(),
                        d.getMedicoNombre(),
                        d.getMedicoEspecialidad(),
                        d.getMedicoColegiatura(),
                        d.getFechaAtencion()),
                d.getFechaInicio(),
                d.getFechaFin(),
                d.getDias(),
                d.getJustificacion(),
                d.getFechaEmision(),
                d.getMetodoConfirmacion(),
                d.getFechaConfirmacion(),
                d.getTipoFirma(),
                d.getAlgoritmoFirma(),
                d.getFirma(),
                d.getHashContenido(),
                c == null ? null : new CancelacionDescansoMedicoDTO(
                        c.getFechaCancelacion(), c.getMotivo(), nombreUsuario(c.getUsuario())),
                segundosParaCancelar(d, c));
    }

    private Long segundosParaCancelar(DescansoMedico d, CancelacionDescansoMedico c) {
        if (c != null) {
            return null;
        }
        LocalDateTime limite = d.getFechaEmision().plusMinutes(DescansoMedicoReglas.MINUTOS_PARA_CANCELAR);
        return Math.max(0L, Duration.between(LocalDateTime.now(), limite).getSeconds());
    }

    public String nombreUsuario(Usuario u) {
        return u.getPersona() == null ? "Sistema" : nombreCompleto(u.getPersona());
    }

    public String nombreCompleto(Persona p) {
        return (p.getNombre() + " " + p.getApellidos()).trim();
    }

    public String documento(Persona p) {
        return p.getTipoDocumento().getCodigo() + " " + p.getNumeroDocumento();
    }
}