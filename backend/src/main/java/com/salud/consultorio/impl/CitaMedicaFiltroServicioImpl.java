package com.salud.consultorio.impl;

import com.salud.consultorio.dto.citaMedica.CitaMedicaFiltroDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaPaginaDTO;
import com.salud.consultorio.dto.citaMedica.CitaMedicaRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.entity.Usuario;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IUsuarioRepositorio;
import com.salud.consultorio.service.ICitaMedicaFiltroServicio;
import com.salud.consultorio.service.specification.CitaMedicaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CitaMedicaFiltroServicioImpl implements ICitaMedicaFiltroServicio {

    private static final int TAMANIO_MAXIMO = 100;

    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;

    @Override
    @Transactional(readOnly = true)
    public CitaMedicaPaginaDTO buscar(CitaMedicaFiltroDTO filtro, Pageable pageable) {
        validar(filtro);

        Integer personaMedico = null;
        Integer personaPaciente = null;

        Usuario usuario = usuarioAutenticado();
        if (usuarioRepositorio.tieneRolActivo(usuario.getId(), "MEDICO")) {
            personaMedico = usuario.getPersona().getId();
        } else if (usuarioRepositorio.tieneRolActivo(usuario.getId(), "PACIENTE")) {
            personaPaciente = usuario.getPersona().getId();
        }

        Pageable seguro = PageRequest.of(
                Math.max(pageable.getPageNumber(), 0),
                Math.min(Math.max(pageable.getPageSize(), 1), TAMANIO_MAXIMO),
                Sort.by(Sort.Order.desc("fechaCita"), Sort.Order.desc("horaInicio")));

        Page<CitaMedica> pagina = citaMedicaRepositorio.findAll(
                CitaMedicaSpecification.de(filtro, personaMedico, personaPaciente), seguro);

        return new CitaMedicaPaginaDTO(
                pagina.getContent().stream().map(this::aRespuesta).toList(),
                pagina.getNumber(),
                pagina.getSize(),
                pagina.getTotalElements(),
                pagina.getTotalPages());
    }

    private void validar(CitaMedicaFiltroDTO f) {
        if (f.fechaDesde() != null && f.fechaHasta() != null && f.fechaDesde().isAfter(f.fechaHasta())) {
            throw error("La fecha 'desde' no puede ser posterior a la fecha 'hasta'");
        }
        if (f.horaDesde() != null && f.horaHasta() != null && f.horaDesde().isAfter(f.horaHasta())) {
            throw error("La hora 'desde' no puede ser posterior a la hora 'hasta'");
        }
        if (f.diaSemana() != null && (f.diaSemana() < 1 || f.diaSemana() > 7)) {
            throw error("El día de la semana debe estar entre 1 (lunes) y 7 (domingo)");
        }
        if (f.estado() != null && f.estado().stream().anyMatch(e -> e == null || e < 1 || e > 5)) {
            throw error("Estado inválido (1 a 5)");
        }
    }

    private ResponseStatusException error(String mensaje) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, mensaje);
    }

    private Usuario usuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }
        return usuarioRepositorio.findByUsuario(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario no autorizado"));
    }

    private CitaMedicaRespuestaDTO aRespuesta(CitaMedica c) {
        Persona pp = c.getPaciente().getPersona();
        Persona mp = c.getMedico().getEmpleado().getPersona();
        return new CitaMedicaRespuestaDTO(
                c.getId(),
                c.getPaciente().getId(),
                pp.getNombre() + " " + pp.getApellidos(),
                c.getMedico().getId(),
                mp.getNombre() + " " + mp.getApellidos(),
                c.getUsuario().getId(),
                c.getFechaCita(),
                c.getHoraInicio(),
                c.getHoraSalida(),
                c.getMotivo(),
                c.getEstado(),
                c.getInicioAtencion());
    }
}