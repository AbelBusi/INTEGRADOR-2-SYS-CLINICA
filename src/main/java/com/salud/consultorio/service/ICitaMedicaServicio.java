package com.salud.consultorio.service;

import com.salud.consultorio.dto.citaMedica.*;
import com.salud.consultorio.model.entity.CitaMedica;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ICitaMedicaServicio{

    CitaMedicaLeerDTO mostrarCitaMedicaPorId(Integer id);

    List<CitaMedicaLeerDTO> leerCitasMedicas();

    List<CitaMedicaLeerDTO> leerCitasMedicasActivas();

    List<CitaMedicaLeerDTO> leerCitasMedicasInactivas();

    List<CitaMedicaLeerDTO> leerCitasPorRecepcionista(String usuario);

    List<DoctorCitaDTO> citasDoctor(String usuario, Integer estado);

    List<com.salud.consultorio.dto.doctor.PacienteDoctorDTO> pacientesDoctor(String usuario, Integer estado);

    List<PacienteCitaDTO> citasPaciente(String usuario);

    CitaMedicaActualizarRespuestaDTO actualizar(CitaMedicaActualizarDTO citaMedicaActualizarDTO, Integer id);

    List<CitaMedica> listarTodos();

    CitaMedicaRespuestaDTO crearCita(CitaMedicaCrearDTO dto);

    Optional<CitaMedica> obtenerPorId(Integer id);

    boolean cruceHorarios(LocalDate fecha,LocalTime horaSalida, LocalTime horaEntrada, Integer id);

    CitaMedica crear(CitaMedicaDTO dto);

    void eliminarPorId(Integer id);

    List<DoctorCitaAtendidaDTO> listarCitasAtendidasPorDoctor(Integer idUsuario, Integer idEstado);
    List<DoctorCitaAtendidaDTO> listarCitasAtendidasPorDoctorHistorial(Integer idUsuario);
}