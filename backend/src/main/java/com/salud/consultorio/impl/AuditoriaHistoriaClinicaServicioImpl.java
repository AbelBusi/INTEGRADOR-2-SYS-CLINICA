package com.salud.consultorio.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salud.consultorio.auth.UsuarioAutenticadoProvider;
import com.salud.consultorio.dto.historiaClinica.AuditoriaHistoriaClinicaRespuestaDTO;
import com.salud.consultorio.dto.historiaClinica.PaginaDTO;
import com.salud.consultorio.model.entity.AuditoriaHistoriaClinica;
import com.salud.consultorio.model.entity.HistoriaClinica;
import com.salud.consultorio.model.entity.Paciente;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.enums.EntidadAuditoriaHC;
import com.salud.consultorio.model.enums.OperacionAuditoriaHC;
import com.salud.consultorio.repository.IAuditoriaHistoriaClinicaRepositorio;
import com.salud.consultorio.repository.IHistoriaClinicaRepositorio;
import com.salud.consultorio.service.IAuditoriaHistoriaClinicaServicio;
import com.salud.consultorio.service.IHistoriaClinicaAccesoServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditoriaHistoriaClinicaServicioImpl implements IAuditoriaHistoriaClinicaServicio {

    private static final int TAMANIO_MAXIMO = 50;

    private final IAuditoriaHistoriaClinicaRepositorio auditoriaRepositorio;
    private final IHistoriaClinicaRepositorio historiaClinicaRepositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;
    private final UsuarioAutenticadoProvider usuarioAutenticadoProvider;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    // MANDATORY: la auditoría solo se guarda dentro de la transacción del cambio clínico
    @Transactional(propagation = Propagation.MANDATORY)
    @Override
    public void registrar(HistoriaClinica historia, EntidadAuditoriaHC entidad, Integer idRegistro,
                          OperacionAuditoriaHC operacion,
                          Map<String, Object> datosAnteriores, Map<String, Object> datosNuevos) {

        AuditoriaHistoriaClinica evento = AuditoriaHistoriaClinica.builder()
                .historiaClinica(historia)
                .entidad(entidad)
                .idRegistro(idRegistro)
                .operacion(operacion)
                .usuario(usuarioAutenticadoProvider.obtener())
                .fechaEvento(LocalDateTime.now(clock))
                .datosAnteriores(serializar(datosAnteriores))
                .datosNuevos(serializar(datosNuevos))
                .build();

        auditoriaRepositorio.save(evento);

    }

    /** Médico: puede consultar la auditoría de cualquier historia clínica. */
    @Transactional(readOnly = true)
    @Override
    public PaginaDTO<AuditoriaHistoriaClinicaRespuestaDTO> listarPorHistoria(Integer idHistoria,
                                                                             int pagina, int tamanio) {

        accesoServicio.medicoAutenticado();

        HistoriaClinica historia = historiaClinicaRepositorio.findById(idHistoria).orElseThrow(
                () -> new EntityNotFoundException("No existe la historia clínica")
        );

        return construir(historia.getId(), pagina, tamanio);

    }

    /** Paciente: la identidad sale del JWT, así que solo puede ver la auditoría de su propia historia. */
    @Transactional(readOnly = true)
    @Override
    public PaginaDTO<AuditoriaHistoriaClinicaRespuestaDTO> listarMias(int pagina, int tamanio) {

        Paciente paciente = accesoServicio.pacienteTitular();

        HistoriaClinica historia = historiaClinicaRepositorio.findByPaciente_Id(paciente.getId()).orElseThrow(
                () -> new EntityNotFoundException("Aún no tiene historia clínica")
        );

        return construir(historia.getId(), pagina, tamanio);

    }

    private PaginaDTO<AuditoriaHistoriaClinicaRespuestaDTO> construir(Integer idHistoria, int pagina, int tamanio) {

        Page<AuditoriaHistoriaClinica> eventos = auditoriaRepositorio
                .findByHistoriaClinica_IdOrderByFechaEventoDescIdDesc(
                        idHistoria,
                        PageRequest.of(Math.max(pagina, 0), Math.min(Math.max(tamanio, 1), TAMANIO_MAXIMO))
                );

        List<AuditoriaHistoriaClinicaRespuestaDTO> contenido = eventos.getContent().stream()
                .map(this::toDto)
                .toList();

        return new PaginaDTO<>(contenido, eventos.getNumber(), eventos.getSize(),
                eventos.getTotalElements(), eventos.getTotalPages());

    }

    private AuditoriaHistoriaClinicaRespuestaDTO toDto(AuditoriaHistoriaClinica e) {

        Persona persona = e.getUsuario().getPersona();

        return new AuditoriaHistoriaClinicaRespuestaDTO(
                e.getId(),
                e.getEntidad(),
                e.getIdRegistro(),
                e.getOperacion(),
                persona.getNombre() + " " + persona.getApellidos(),
                e.getFechaEvento(),
                deserializar(e.getDatosAnteriores()),
                deserializar(e.getDatosNuevos())
        );

    }

    private String serializar(Map<String, Object> datos) {

        if (datos == null || datos.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(datos);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar los datos de auditoría.", e);
        }

    }

    // Un registro ilegible no debe impedir ver el resto del historial
    private Map<String, Object> deserializar(String json) {

        if (json == null || json.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return null;
        }

    }

}