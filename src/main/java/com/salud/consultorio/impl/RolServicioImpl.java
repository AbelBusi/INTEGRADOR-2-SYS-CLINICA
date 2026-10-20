package com.salud.consultorio.impl;

import com.salud.consultorio.auth.dto.rol.*;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.mapper.IRolMapper;
import com.salud.consultorio.repository.IRolRepositorio;
import com.salud.consultorio.service.IRolServicio;
import com.salud.consultorio.service.IUsuarioRolServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolServicioImpl implements IRolServicio {

    private final IRolRepositorio rolRepositorio;
    private final IRolMapper rolMapper;
    private final IUsuarioRolServicio usuarioRolServicio;

    @Transactional(readOnly = true)
    @Override
    public List<RolRespuestaDTO> leerTodos(EntidadEstado estado) {

        return listaPorEstado(estado);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeRolId(Integer id) {
        return rolRepositorio.existsById(id);
    }

    @Transactional
    @Override
    public IRolRespuestaDTO crear(RolCrearDTO dto) {

        if (rolRepositorio.existsByNombre(dto.nombre())){
            throw new DataIntegrityViolationException("El rol ya existe, no se puede duplicar");
        }

        Rol rol = rolMapper.toEntity(dto);

        rolRepositorio.save(rol);

        return rolMapper.toDtoRol(rol);
    }

    @Transactional
    @Override
    public IRolRespuestaDTO actualizar(RolActualizarDTO dto, Integer id) {

        Rol rol = rolRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("El rol no existe")
        );

        validarDatosUnicos(dto,id);

        rolMapper.updateFromDto(dto, rol);

        return rolMapper.toDtoRol(rol);
    }

    @Transactional(readOnly = true)
    @Override
    public List<RolResumenDTO> listaResumen() {
        return rolRepositorio.listaPorNombreResumen();
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!existeRolId(id)){
            throw new EntityNotFoundException("El rol que desea eliminar no existe");
        }

        if (usuarioRolServicio.existeUsuarioPorRol(id)) {
            throw new DataIntegrityViolationException(
                    "No se puede eliminar el rol porque está siendo utilizado por uno o más usuarios"
            );
        }

        rolRepositorio.eliminarLogicamente(id);

    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        Rol rol = validarCambiarEstado(id, estado);

        if (rol.getEstado() == 0) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un rol eliminado.");
        }

        if (estado == EntidadEstado.ACTIVO) {

            if (rol.getEstado() == 1) {
                throw new IllegalArgumentException("El rol ya se encuentra activo.");
            }

            rolRepositorio.activarLogicamente(rol.getId());

        }

        if (estado == EntidadEstado.INACTIVO) {

            if (rol.getEstado() == 2) {
                throw new IllegalArgumentException("El rol ya se encuentra desactivado.");
            }

            rolRepositorio.desactivarLogicamente(rol.getId());

            usuarioRolServicio.revocarSesionesPorRol(rol.getId());

        }

    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeRolNombre(String nombre) {
        return rolRepositorio.existsByNombre(nombre);
    }

    @Transactional(readOnly = true)
    @Override
    public Rol entidadPorIDTransaccion(Integer id) {
        return rolRepositorio.findById(id).orElseThrow(
                ()-> new EntityNotFoundException("No existe el rol")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public IRolRespuestaDTO entidadPorID(Integer id) {
        return rolRepositorio.findById(id).map(
                rolMapper::toDtoRol
        ).orElseThrow(()-> new EntityNotFoundException("El rol no existe en la entidad."));
    }

    private Rol validarCambiarEstado(Integer id, EntidadEstado estado) {

        if (id == null || estado == null) {
            throw new IllegalArgumentException("El id y el estado son obligatorios.");
        }

        return rolRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El rol al que desea cambiarle el estado no existe.")
        );

    }

    private List<RolRespuestaDTO> listaPorEstado(EntidadEstado estado) {

        if (estado == EntidadEstado.ACTIVO) {
            return rolRepositorio.listaPorEstado(1);
        }

        if (estado == EntidadEstado.INACTIVO) {
            return rolRepositorio.listaPorEstado(2);
        }

        return rolRepositorio.listaPorEstadoActivoInactivo();

    }

    private void validarDatosUnicos(RolActualizarDTO dto, Integer id) {

        if (rolRepositorio.existsByNombreAndIdNot(dto.nombre(), id)) {

            throw new DataIntegrityViolationException(
                    "El nombre ya pertenece a otro rol."
            );
        }

    }

}