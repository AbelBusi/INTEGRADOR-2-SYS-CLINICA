package com.salud.consultorio.impl;

import com.salud.consultorio.dto.descansoMedico.*;
import com.salud.consultorio.model.entity.AuditoriaDescansoMedico;
import com.salud.consultorio.model.entity.CancelacionDescansoMedico;
import com.salud.consultorio.model.entity.DescansoMedico;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.IAuditoriaDescansoMedicoRepositorio;
import com.salud.consultorio.repository.ICancelacionDescansoMedicoRepositorio;
import com.salud.consultorio.repository.IDescansoMedicoRepositorio;
import com.salud.consultorio.service.IAuditoriaDescansoMedicoServicio;
import com.salud.consultorio.service.IDescansoMedicoGestionServicio;
import com.salud.consultorio.service.IVerificacionDobleFactorServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DescansoMedicoGestionServicioImpl implements IDescansoMedicoGestionServicio {

    private final IDescansoMedicoRepositorio descansoRepositorio;
    private final ICancelacionDescansoMedicoRepositorio cancelacionRepositorio;
    private final IAuditoriaDescansoMedicoRepositorio auditoriaRepositorio;
    private final IVerificacionDobleFactorServicio verificacionServicio;
    private final IAuditoriaDescansoMedicoServicio auditoriaServicio;
    private final UsuarioActualResolver usuarioActual;
    private final DescansoMedicoMapeador mapeador;

    @Override
    @Transactional(readOnly = true)
    public List<DescansoMedicoRespuestaDTO> listarMisDocumentos() {
        Usuario usuario = usuarioActual.obtener();
        return mapeador.respuestas(descansoRepositorio.findByUsuario_IdOrderByFechaEmisionDesc(usuario.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public DescansoMedicoHistorialDTO historial(Integer idDescanso) {
        DescansoMedico d = buscar(idDescanso);

        List<AuditoriaDescansoMedicoDTO> eventos = auditoriaRepositorio
                .findByCitaMedica_IdOrderByFechaEventoAsc(d.getCitaMedica().getId())
                .stream()
                .map(this::evento)
                .toList();

        return new DescansoMedicoHistorialDTO(mapeador.respuesta(d), eventos);
    }

    @Override
    @Transactional
    public DescansoMedicoRespuestaDTO cancelar(Integer idDescanso, DescansoMedicoCancelarDTO dto, String ipOrigen) {
        DescansoMedico d = buscar(idDescanso);
        Usuario usuario = usuarioActual.obtener();

        if (!d.getUsuario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo el médico que emitió el descanso puede cancelarlo.");
        }

        if (cancelacionRepositorio.existsByDescansoMedico_Id(idDescanso)) {
            throw yaCancelado();
        }

        if (!verificacionServicio.verificar(usuario.getId(), dto.codigoVerificacion())) {
            auditoriaServicio.registrarCodigoInvalidoCancelacion(d, usuario, ipOrigen);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El código de verificación es incorrecto.");
        }

        CancelacionDescansoMedico cancelacion;
        try {
            cancelacion = cancelacionRepositorio.saveAndFlush(CancelacionDescansoMedico.builder()
                    .descansoMedico(d)
                    .usuario(usuario)
                    .fechaCancelacion(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                    .motivo(dto.motivo().trim())
                    .ipOrigen(ipOrigen)
                    .build());
        } catch (DataIntegrityViolationException e) {
            throw yaCancelado();
        }

        auditoriaServicio.registrarCancelacion(cancelacion, ipOrigen);
        return mapeador.respuesta(d, cancelacion);
    }

    private AuditoriaDescansoMedicoDTO evento(AuditoriaDescansoMedico a) {
        return new AuditoriaDescansoMedicoDTO(
                a.getId(),
                a.getResultado().name(),
                a.getFechaEvento(),
                mapeador.nombreUsuario(a.getUsuario()),
                a.getIpOrigen(),
                a.getCodigoDocumento(),
                a.getHashContenido(),
                a.getFechaInicio(),
                a.getFechaFin(),
                a.getDias(),
                a.getJustificacion(),
                a.getObservacion());
    }

    private DescansoMedico buscar(Integer id) {
        return descansoRepositorio.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Descanso médico no encontrado."));
    }

    private ResponseStatusException yaCancelado() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "El descanso médico ya está cancelado.");
    }
}