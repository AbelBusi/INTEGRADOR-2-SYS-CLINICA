package com.salud.consultorio.impl;

import com.salud.consultorio.dto.empleado.*;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.model.entity.Cargo;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.enums.RutasImagen;
import com.salud.consultorio.model.mapper.IEmpleadoMapper;
import com.salud.consultorio.repository.ICargoRepositorio;
import com.salud.consultorio.repository.IEmpleadoRepositorio;
import com.salud.consultorio.service.IArchivoServicio;
import com.salud.consultorio.service.IEmpleadoServicio;
import com.salud.consultorio.service.IPersonaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmpleadoServicioImpl implements IEmpleadoServicio {

    private static final int ESTADO_ELIMINADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;
    private static final RutasImagen RUTAS_IMAGEN = RutasImagen.EMPLEADOS;


    private final IEmpleadoRepositorio empleadoRepositorio;
    private final ICargoRepositorio cargoRepositorio;
    private final IPersonaServicio personaServicio;
    private final IEmpleadoMapper empleadoMapper;
    private final IArchivoServicio archivoServicio;

    @Transactional(readOnly = true)
    @Override
    public EmpleadoDetalleDTO entidadPorID(Integer id) {

        validarId(id);

        return empleadoRepositorio.buscarDetallePorId(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("No se encontró el empleado con ID: " + id)
                );
    }

    @Transactional(readOnly = true)
    @Override
    public List<EmpleadoLeerDTO> lista(EntidadEstado estado) {

        if (estado == EntidadEstado.ACTIVO) {
            return empleadoRepositorio.listaPorEstado(ESTADO_ACTIVO);
        }

        if (estado == EntidadEstado.INACTIVO) {
            return empleadoRepositorio.listaPorEstado(ESTADO_INACTIVO);
        }

        return empleadoRepositorio.listaPorEstadoActivoInactivo();
    }

    @Transactional(readOnly = true)
    @Override
    public List<EmpleadoMedicoResumenDTO> listaEmpleadoMedico() {
        return empleadoRepositorio.listarEmpleadoCargoMedico();
    }

    @Transactional(readOnly = true)
    @Override
    public List<EmpleadoActivoResumenDTO> listaEmpleadosActivos() {
        return empleadoRepositorio.listarEmpleadosActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<EmpleadoActivoResumenDTO> listaEmpleadosActivosCargo(Integer id) {
        return empleadoRepositorio.listarEmpleadosActivosPorCargo(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Empleado entidadPorIDTransaccion(Integer id) {
        return empleadoRepositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El empleado que desea validar no existe o no se encuentra."));
    }

    @Transactional
    @Override
    public EmpleadoRespuestaDTO crear(EmpleadoCrearDTO dto, MultipartFile imagen) {

        if (dto == null || dto.persona() == null || dto.idCargo() == null) {
            throw new IllegalArgumentException("Los datos del empleado son obligatorios.");
        }

        if (personaServicio.existePersonaNumeroDocumento(dto.persona().numeroDocumento())){
            throw new IllegalArgumentException("Ya existe un empleado con este numero de documento.");
        }

        if (personaServicio.existePersonaCorreo(dto.persona().correo())){
            throw new IllegalArgumentException("Ya existe un empleado con este correo.");
        }

        if (personaServicio.existePersonaTelefono(dto.persona().telefono())){
            throw new IllegalArgumentException("Ya existe un empleado con este telefono.");
        }

        Cargo cargo = obtenerCargoActivo(dto.idCargo());

        Empleado empleado = empleadoMapper.toEntity(dto);

        Persona persona = personaServicio.crear(dto.persona());

        empleado.setPersona(persona);
        empleado.setCargo(cargo);

        if (imagen != null && !imagen.isEmpty()){
            String imagenUrl = archivoServicio.guardar(
                    imagen, RUTAS_IMAGEN
            );

            empleado.setFoto(imagenUrl);
        }

        Empleado guardado = empleadoRepositorio.save(empleado);

        return empleadoMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public EmpleadoRespuestaDTO actualizar(EmpleadoActualizarDTO dto, Integer id, MultipartFile imagen) {

        validarId(id);

        if (dto == null || dto.persona() == null || dto.idCargo() == null) {
            throw new IllegalArgumentException("Los datos del empleado son obligatorios.");
        }

        Empleado empleado = empleadoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El empleado que desea actualizar no existe.")
        );

        if (empleado.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede actualizar un empleado eliminado.");
        }

        if (!empleado.getCargo().getId().equals(dto.idCargo())) {
            empleado.setCargo(obtenerCargoActivo(dto.idCargo()));
        }

        String fotoAnterior = empleado.getFoto();

        String imagenNueva = null;

        try {

            personaServicio.actualizar(dto.persona(), empleado.getPersona().getId());

            empleadoMapper.updateFromDto(dto, empleado);

            if (imagen != null && !imagen.isEmpty()){

                imagenNueva = archivoServicio.guardar(imagen, RUTAS_IMAGEN);

                empleado.setFoto(imagenNueva);

                if (fotoAnterior != null && !fotoAnterior.isBlank()){
                    archivoServicio.eliminar(fotoAnterior);
                }

            }

        } catch (RuntimeException e){

            if (imagenNueva != null){
                archivoServicio.eliminar(imagenNueva);
            }

            throw e;

        }

        return empleadoMapper.toDto(empleado);
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        validarId(id);

        Empleado empleado = empleadoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El empleado que desea eliminar no existe.")
        );

        if (empleado.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("El empleado ya se encuentra eliminado.");
        }

        empleadoRepositorio.eliminarLogicamente(id);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        validarId(id);

        if (estado == null) {
            throw new IllegalArgumentException("El estado es obligatorio.");
        }

        Empleado empleado = empleadoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El empleado que desea cambiarle el estado no existe.")
        );

        if (empleado.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un empleado eliminado.");
        }

        switch (estado) {

            case ACTIVO -> {
                if (empleado.getEstado() == ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("El empleado ya se encuentra activo.");
                }
                empleadoRepositorio.activarLogicamente(id);
            }

            case INACTIVO -> {
                if (empleado.getEstado() == ESTADO_INACTIVO) {
                    throw new IllegalArgumentException("El empleado ya se encuentra inactivo.");
                }
                empleadoRepositorio.desactivarLogicamente(id);
            }

            default -> throw new IllegalArgumentException("Solo se permite cambiar a estado ACTIVO o INACTIVO.");
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<PersonaUsuarioDTO> listarPacientesSinUusario() {
        return empleadoRepositorio.listarParaCrearUsuario();
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeEmpleadoPorCargo(Integer idCargo) {
        return empleadoRepositorio.existsByCargoId(idCargo);
    }

    private void validarId(Integer id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID del empleado debe ser válido.");
        }

    }

    private Cargo obtenerCargoActivo(Integer idCargo) {

        return cargoRepositorio.findByIdAndEstado(idCargo, ESTADO_ACTIVO).orElseThrow(
                () -> new EntityNotFoundException("El cargo seleccionado no existe o no está activo.")
        );

    }

}