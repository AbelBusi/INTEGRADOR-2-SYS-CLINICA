package com.salud.consultorio.impl;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoCrearDTO;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.model.enums.ResultadoAuditoriaDescanso;
import com.salud.consultorio.repository.IAuditoriaDescansoMedicoRepositorio;
import com.salud.consultorio.service.IAuditoriaDescansoMedicoServicio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditoriaDescansoMedicoServicioImpl implements IAuditoriaDescansoMedicoServicio {

    private final IAuditoriaDescansoMedicoRepositorio auditoriaRepositorio;

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void registrarEmision(DescansoMedico d, String ipOrigen) {
        auditoriaRepositorio.save(AuditoriaDescansoMedico.builder()
                .descansoMedico(d)
                .citaMedica(d.getCitaMedica())
                .paciente(d.getPaciente())
                .medico(d.getMedico())
                .usuario(d.getUsuario())
                .fechaEvento(LocalDateTime.now())
                .ipOrigen(ipOrigen)
                .codigoDocumento(d.getCodigoDocumento())
                .hashContenido(d.getHashContenido())
                .fechaInicio(d.getFechaInicio())
                .fechaFin(d.getFechaFin())
                .dias(d.getDias())
                .justificacion(d.getJustificacion())
                .resultado(ResultadoAuditoriaDescanso.EMITIDO)
                .build());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarCodigoInvalido(CitaMedica cita, Usuario usuario, DescansoMedicoCrearDTO dto, String ipOrigen) {
        // Nunca se guarda ni se registra el código ingresado.
        auditoriaRepositorio.save(AuditoriaDescansoMedico.builder()
                .citaMedica(em.getReference(CitaMedica.class, cita.getId()))
                .paciente(em.getReference(Paciente.class, cita.getPaciente().getId()))
                .medico(em.getReference(Medico.class, cita.getMedico().getId()))
                .usuario(em.getReference(Usuario.class, usuario.getId()))
                .fechaEvento(LocalDateTime.now())
                .ipOrigen(ipOrigen)
                .fechaInicio(dto.fechaInicio())
                .fechaFin(dto.fechaFin())
                .dias(dto.dias())
                .justificacion(dto.justificacion())
                .resultado(ResultadoAuditoriaDescanso.CODIGO_INVALIDO)
                .build());
    }
}