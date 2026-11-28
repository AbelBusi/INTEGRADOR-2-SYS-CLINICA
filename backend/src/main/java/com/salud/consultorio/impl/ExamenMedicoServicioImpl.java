package com.salud.consultorio.impl;

import com.salud.consultorio.dto.examenMedico.ExamenMedicoBusquedaDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRequestDTO;
import com.salud.consultorio.dto.examenMedico.ExamenMedicoRespuestaDTO;
import com.salud.consultorio.model.entity.ExamenMedico;
import com.salud.consultorio.repository.IExamenMedicoRepositorio;
import com.salud.consultorio.service.IExamenMedicoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamenMedicoServicioImpl implements IExamenMedicoServicio {

    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;

    private static final int BUSQUEDA_MIN_CARACTERES = 3;
    private static final int BUSQUEDA_MAX_CARACTERES = 150;
    private static final int BUSQUEDA_MAX_RESULTADOS = 10;

    private final IExamenMedicoRepositorio repositorio;

    @Override
    @Transactional(readOnly = true)
    public List<ExamenMedicoRespuestaDTO> listar(String estado) {
        if (estado == null || estado.isBlank()) {
            return repositorio.listaPorEstadoActivoInactivo();
        }
        return repositorio.listaPorEstado(convertirEstado(estado));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamenMedicoBusquedaDTO> buscarPorNombre(String busqueda) {
        String termino = busqueda == null ? "" : busqueda.trim();

        if (termino.length() < BUSQUEDA_MIN_CARACTERES) {
            return List.of();
        }
        if (termino.length() > BUSQUEDA_MAX_CARACTERES) {
            termino = termino.substring(0, BUSQUEDA_MAX_CARACTERES);
        }

        return repositorio.buscarPorNombre(escaparComodines(termino), PageRequest.of(0, BUSQUEDA_MAX_RESULTADOS));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamenMedicoBusquedaDTO> listarResumen() {
        return repositorio.listaResumen();
    }

    @Override
    @Transactional
    public ExamenMedicoRespuestaDTO crear(ExamenMedicoRequestDTO request) {
        String nombre = validarNombre(request.nombre());
        String tipoExamen = validarTipoExamen(request.tipoExamen());
        String descripcion = validarDescripcion(request.descripcion());

        if (repositorio.existsByNombreIgnoreCase(nombre)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un examen médico con ese nombre.");
        }

        ExamenMedico examen = new ExamenMedico();
        examen.setNombre(nombre);
        examen.setTipoExamen(tipoExamen);
        examen.setDescripcion(descripcion);
        examen.setEstado(ESTADO_ACTIVO);

        return aRespuestaDTO(repositorio.save(examen));
    }

    @Override
    @Transactional
    public ExamenMedicoRespuestaDTO actualizar(Integer id, ExamenMedicoRequestDTO request) {
        ExamenMedico examen = buscarPorId(id);

        String nombre = validarNombre(request.nombre());
        String tipoExamen = validarTipoExamen(request.tipoExamen());
        String descripcion = validarDescripcion(request.descripcion());

        if (repositorio.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un examen médico con ese nombre.");
        }

        examen.setNombre(nombre);
        examen.setTipoExamen(tipoExamen);
        examen.setDescripcion(descripcion);

        return aRespuestaDTO(repositorio.save(examen));
    }

    @Override
    @Transactional
    public void cambiarEstado(Integer id, String estado) {
        buscarPorId(id);

        if (convertirEstado(estado) == ESTADO_ACTIVO) {
            repositorio.activarLogicamente(id);
        } else {
            repositorio.desactivarLogicamente(id);
        }
    }

    private ExamenMedico buscarPorId(Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Examen médico no encontrado."));
    }

    private int convertirEstado(String estado) {
        if ("activo".equalsIgnoreCase(estado)) {
            return ESTADO_ACTIVO;
        }
        if ("inactivo".equalsIgnoreCase(estado)) {
            return ESTADO_INACTIVO;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido. Use ACTIVO o INACTIVO.");
    }

    /** Evita que % y _ digitados por el usuario actúen como comodines del LIKE. */
    private String escaparComodines(String termino) {
        return termino.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    private String validarNombre(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio.");
        }
        String valor = nombre.trim();
        if (valor.length() > 150) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre no puede superar los 150 caracteres.");
        }
        return valor;
    }

    private String validarTipoExamen(String tipoExamen) {
        if (tipoExamen == null || tipoExamen.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de examen es obligatorio.");
        }
        String valor = tipoExamen.trim();
        if (valor.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de examen no puede superar los 50 caracteres.");
        }
        return valor;
    }

    private String validarDescripcion(String descripcion) {
        if (descripcion == null || descripcion.isBlank()) {
            return null;
        }
        String valor = descripcion.trim();
        if (valor.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripción no puede superar los 255 caracteres.");
        }
        return valor;
    }

    private ExamenMedicoRespuestaDTO aRespuestaDTO(ExamenMedico e) {
        return new ExamenMedicoRespuestaDTO(e.getId(), e.getNombre(), e.getTipoExamen(), e.getDescripcion(), e.getEstado());
    }
}