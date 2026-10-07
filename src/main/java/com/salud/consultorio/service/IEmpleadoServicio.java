package com.salud.consultorio.service;

import com.salud.consultorio.dto.empleado.*;
import com.salud.consultorio.dto.usuario.PersonaUsuarioDTO;
import com.salud.consultorio.model.entity.Empleado;
import com.salud.consultorio.model.enums.EntidadEstado;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IEmpleadoServicio {

    EmpleadoDetalleDTO entidadPorID(Integer id);

    List<EmpleadoLeerDTO> lista(EntidadEstado estado);

    List<EmpleadoMedicoResumenDTO> listaEmpleadoMedico();

    List<EmpleadoActivoResumenDTO> listaEmpleadosActivos();

    List<EmpleadoActivoResumenDTO> listaEmpleadosActivosCargo(Integer id);

    Empleado entidadPorIDTransaccion(Integer id);

    EmpleadoRespuestaDTO crear(EmpleadoCrearDTO dto, MultipartFile imagen);

    EmpleadoRespuestaDTO actualizar(EmpleadoActualizarDTO dto, Integer id, MultipartFile imagen);

    void eliminarPorId(Integer id);

    void cambiarEstado(Integer id, EntidadEstado estado);

    List<PersonaUsuarioDTO> listarPacientesSinUusario();

}