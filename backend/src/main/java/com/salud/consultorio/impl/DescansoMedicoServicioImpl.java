package com.salud.consultorio.impl;

import com.salud.consultorio.dto.descansoMedico.*;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.DescansoMedico;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IDescansoMedicoRepositorio;
import com.salud.consultorio.service.IAuditoriaDescansoMedicoServicio;
import com.salud.consultorio.service.IDescansoMedicoServicio;
import com.salud.consultorio.service.IFirmaElectronicaServicio;
import com.salud.consultorio.service.IFirmaElectronicaServicio.DatosFirma;
import com.salud.consultorio.service.IFirmaElectronicaServicio.FirmaElectronica;
import com.salud.consultorio.service.IVerificacionDobleFactorServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DescansoMedicoServicioImpl implements IDescansoMedicoServicio {

    private static final int ESTADO_ATENDIDA = 3;
    private static final int HORAS_LIMITE = 24;

    private final ICitaMedicaRepositorio citaRepositorio;
    private final UsuarioActualResolver usuarioActualResolver;
    private final IDescansoMedicoRepositorio descansoRepositorio;
    private final IVerificacionDobleFactorServicio verificacionServicio;
    private final IFirmaElectronicaServicio firmaServicio;
    private final IAuditoriaDescansoMedicoServicio auditoriaServicio;
    private final DescansoMedicoMapeador mapeador;

    @Override
    @Transactional(readOnly = true)
    public DescansoMedicoContextoDTO contexto(Integer idCita) {
        CitaMedica cita = buscarCita(idCita);
        DescansoMedicoDatosBaseDTO datos = mapeador.datosBase(cita);

        var existente = descansoRepositorio.findByCitaMedica_Id(idCita);
        if (existente.isPresent()) {
            return new DescansoMedicoContextoDTO(mapeador.respuesta(existente.get()), datos, false,
                    "Ya existe un descanso médico para esta atención.", null);
        }

        ResponseStatusException bloqueo = bloqueo(cita, usuarioActualResolver.obtener());
        return new DescansoMedicoContextoDTO(null, datos, bloqueo == null,
                bloqueo == null ? null : bloqueo.getReason(), limiteEmision(cita));
    }

    @Override
    @Transactional
    public DescansoMedicoRespuestaDTO emitir(Integer idCita, DescansoMedicoCrearDTO dto, String ipOrigen) {
        CitaMedica cita = buscarCita(idCita);
        Usuario usuario = usuarioActualResolver.obtener();

        if (descansoRepositorio.existsByCitaMedica_Id(idCita)) {
            throw yaExiste();
        }

        ResponseStatusException bloqueo = bloqueo(cita, usuario);
        if (bloqueo != null) {
            throw bloqueo;
        }

        validarPeriodo(dto);

        if (!verificacionServicio.verificar(usuario.getId(), dto.codigoVerificacion())) {
            auditoriaServicio.registrarCodigoInvalido(cita, usuario, dto, ipOrigen);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El código de verificación es incorrecto.");
        }

        // Sin fracciones de segundo: coincide exactamente con lo que guarda la base de datos.
        LocalDateTime ahora = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        String codigoDocumento = UUID.randomUUID().toString();
        String numero = String.format("DM-%d-%06d", ahora.getYear(), idCita);
        String justificacion = dto.justificacion().trim();
        String metodo = verificacionServicio.metodo();

        var datos = mapeador.datosBase(cita);
        FirmaElectronica firma = firmaServicio.firmar(new DatosFirma(
                codigoDocumento, numero, idCita,
                cita.getPaciente().getId(), datos.pacienteDocumento(),
                cita.getMedico().getId(), datos.medicoNombre(), datos.numeroColegiatura(), datos.especialidad(),
                datos.fechaAtencion(), dto.fechaInicio(), dto.fechaFin(), dto.dias(),
                justificacion, ahora, metodo));

        DescansoMedico descanso;
        try {
            descanso = descansoRepositorio.saveAndFlush(DescansoMedico.builder()
                    .citaMedica(cita)
                    .paciente(cita.getPaciente())
                    .medico(cita.getMedico())
                    .usuario(usuario)
                    .numero(numero)
                    .codigoDocumento(codigoDocumento)
                    .pacienteNombre(datos.pacienteNombre())
                    .pacienteDocumento(datos.pacienteDocumento())
                    .medicoNombre(datos.medicoNombre())
                    .medicoEspecialidad(datos.especialidad())
                    .medicoColegiatura(datos.numeroColegiatura())
                    .fechaAtencion(datos.fechaAtencion())
                    .fechaInicio(dto.fechaInicio())
                    .fechaFin(dto.fechaFin())
                    .dias(dto.dias())
                    .justificacion(justificacion)
                    .fechaEmision(ahora)
                    .metodoConfirmacion(metodo)
                    .fechaConfirmacion(ahora)
                    .tipoFirma(firma.tipo())
                    .algoritmoFirma(firma.algoritmo())
                    .firma(firma.firma())
                    .hashContenido(firma.hashContenido())
                    .build());
        } catch (DataIntegrityViolationException e) {
            // La restricción única sobre id_cita_medica cubre la emisión simultánea.
            throw yaExiste();
        }

        auditoriaServicio.registrarEmision(descanso, ipOrigen);
        return mapeador.respuesta(descanso);
    }

    // ---- reglas (todas en backend) ----

    private ResponseStatusException bloqueo(CitaMedica cita, Usuario usuario) {
        if (cita.getEstado() == null || cita.getEstado() != ESTADO_ATENDIDA) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Solo se puede generar el descanso médico de una atención realizada.");
        }
        if (LocalDateTime.now().isAfter(limiteEmision(cita))) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Pasaron más de 24 horas desde la atención médica.");
        }
        if (!esMedicoResponsable(cita, usuario)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo el médico responsable de la atención puede generar el descanso médico.");
        }
        return null;
    }

    private LocalDateTime limiteEmision(CitaMedica cita) {
        LocalDateTime fin = cita.getFinAtencion() != null
                ? cita.getFinAtencion()
                : LocalDateTime.of(cita.getFechaCita(), cita.getHoraSalida());
        return fin.plusHours(HORAS_LIMITE);
    }

    private boolean esMedicoResponsable(CitaMedica cita, Usuario usuario) {
        return usuario.getPersona() != null
                && usuario.getPersona().getId().equals(cita.getMedico().getEmpleado().getPersona().getId());
    }

    private void validarPeriodo(DescansoMedicoCrearDTO dto) {
        if (dto.fechaInicio().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La fecha de inicio no puede ser anterior a hoy.");
        }
        if (dto.fechaFin().isBefore(dto.fechaInicio())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio.");
        }
        long esperados = ChronoUnit.DAYS.between(dto.fechaInicio(), dto.fechaFin()) + 1;
        if (dto.dias() != esperados) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La cantidad de días no corresponde al periodo indicado (" + esperados + ").");
        }
    }

    private ResponseStatusException yaExiste() {
        return new ResponseStatusException(HttpStatus.CONFLICT,
                "Ya existe un descanso médico para esta atención.");
    }

    private CitaMedica buscarCita(Integer idCita) {
        return citaRepositorio.findById(idCita).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cita médica no encontrada."));
    }

}