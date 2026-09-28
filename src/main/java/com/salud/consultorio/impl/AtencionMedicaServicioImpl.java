package com.salud.consultorio.impl;

import com.salud.consultorio.dto.atencion.AtencionCrearDTO;
import com.salud.consultorio.dto.atencion.AtencionLeerDTO;
import com.salud.consultorio.model.entity.AtencionMedica;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.repository.IAtencionMedicaRepositorio;
import com.salud.consultorio.repository.ICitaMedicaRepositorio;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.repository.IPacienteRepositorio;
import com.salud.consultorio.service.IAtencionMedicaServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AtencionMedicaServicioImpl implements IAtencionMedicaServicio {

    private final IAtencionMedicaRepositorio atencionMedicaRepositorio;
    private final ICitaMedicaRepositorio citaMedicaRepositorio;
    private final IDoctorRepositorio doctorRepositorio;
    private final IPacienteRepositorio pacienteRepositorio;

    @Transactional
    @Override
    public void atenderCita(Integer citaId, String usuario, AtencionCrearDTO dto) {

        Doctor doctor = doctorRepositorio.findByUsuario(usuario).orElseThrow(
                () -> new EntityNotFoundException("El usuario autenticado no es un doctor")
        );

        CitaMedica cita = citaMedicaRepositorio.findById(citaId).orElseThrow(
                () -> new EntityNotFoundException("La cita no existe")
        );

        if (!cita.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("No puedes atender una cita que no te pertenece");
        }

        if (cita.getEstado() == null || cita.getEstado() != 1) {
            throw new IllegalArgumentException("La cita no se encuentra en un estado que permita ser atendida");
        }

        if (atencionMedicaRepositorio.existsByCitaId(citaId)) {
            throw new DataIntegrityViolationException("La cita ya fue atendida");
        }

        AtencionMedica atencion = AtencionMedica.builder()
                .cita(cita)
                .diagnostico(dto.getDiagnostico())
                .observaciones(dto.getObservaciones())
                .tratamiento(dto.getTratamiento())
                .recomendaciones(dto.getRecomendaciones())
                .fechaAtencion(LocalDate.now())
                .build();

        atencionMedicaRepositorio.save(atencion);

        cita.setEstado(2);
        citaMedicaRepositorio.save(cita);
    }

    @Transactional(readOnly = true)
    @Override
    public List<AtencionLeerDTO> historiaPorPaciente(Integer pacienteId) {
        return atencionMedicaRepositorio.historiaPorPaciente(pacienteId);
    }

    @Transactional(readOnly = true)
    @Override
    public List<AtencionLeerDTO> historiaPorUsuario(String usuario) {
        return pacienteRepositorio.findByUsuario(usuario)
                .map(paciente -> atencionMedicaRepositorio.historiaPorPaciente(paciente.getId()))
                .orElseGet(List::of);
    }
}
