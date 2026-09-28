package com.salud.consultorio.impl;

import com.salud.consultorio.dto.doctor.*;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.entity.Especialidad;
import com.salud.consultorio.model.entity.Persona;
import com.salud.consultorio.model.mapper.IDoctorMapper;
import com.salud.consultorio.model.mapper.IEspecialidadMapper;
import com.salud.consultorio.model.mapper.IPersonaMapper;
import com.salud.consultorio.repository.IDoctorRepositorio;
import com.salud.consultorio.service.IDoctorServicio;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorServicioImpl implements IDoctorServicio {

    private final IDoctorRepositorio doctorRepositorio;
    private final EspecialidadServicioImpl especialidadServicio;
    private final PersonaServicioImpl personaServicio;
    private final IDoctorMapper doctorMapper;
    private final IPersonaMapper personaMapper;
    private final IEspecialidadMapper especialidadMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Doctor> listarTodos() {
        return doctorRepositorio.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public Boolean existeDoctor(Integer id) {
        return doctorRepositorio.existsById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Doctor> obtenerPorId(Integer integer) {
        return doctorRepositorio.findById(integer);
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Doctor> obtenerPorUsuario(String usuario) {
        return doctorRepositorio.findByUsuario(usuario);
    }

    @Transactional
    @Override
    public DoctorRespuestaDTO crear(DoctorCrearDTO dto) {

        if (!especialidadServicio.existeEspecialidad(dto.getEspecialidad().getId())){
            throw new EntityNotFoundException("No existe la especialidad en la entidad");
        }

        if (personaServicio.existePersonaDni(dto.getPersona().getDni())){
            throw new DataIntegrityViolationException("El DNI ya existe en la entidad");
        }

        if (existeCpm(dto.getCpm())){
            throw new DataIntegrityViolationException("El CPM ya existe en la entidad");
        }

        if (existeRne(dto.getRne())){
            throw new DataIntegrityViolationException("El RNE ya se encuentra en la entidad");
        }

        if (personaServicio.existePersonaCorreo(dto.getPersona().getCorreo())){
            throw new DataIntegrityViolationException("El CORREO ya existe en la entidad");
        }

        Doctor doctor = doctorMapper.doctordDtoToDoctor(dto);

        Especialidad especialidad = especialidadMapper.especialidadRefDtoToEspecialidad(dto.getEspecialidad());

        Persona persona = personaMapper.personaDtoToPersona(dto.getPersona());

        doctor.setEspecialidad(especialidad);

        doctor.setPersona(persona);

        Doctor guardado = doctorRepositorio.save(doctor);

        return doctorMapper.toDto(guardado);
    }

    @Transactional
    @Override
    public DoctorRespuestaDTO actualizar(DoctorActualizarDTO dto, Integer id) {

        Doctor doctor = doctorRepositorio.findByIdConPersona(id).orElseThrow(
                ()-> new EntityNotFoundException("El doctor no existe en la entidad")
        );

        if (!especialidadServicio.existeEspecialidad(dto.getEspecialidad().getId())){
            throw new EntityNotFoundException("No existe la especialidad en la entidad");
        }

        String dtoRne = dto.getRne();
        String dtoCpm = dto.getCpm();
        String dtoDni = dto.getPersona().getDni();
        String dtoCorreo = dto.getPersona().getCorreo();

        String strDoctorCpm = doctor.getCpm();
        String strDoctorRne = doctor.getRne();
        String strDoctorDni = doctor.getPersona().getDni();
        String strDoctorCorreo = doctor.getPersona().getCorreo();

        boolean valRne = dtoRne.equalsIgnoreCase(strDoctorRne);
        boolean valCpm = dtoCpm.equalsIgnoreCase(strDoctorCpm);
        boolean valDni = dtoDni.equalsIgnoreCase(strDoctorDni);
        boolean valCorreo = dtoCorreo.equalsIgnoreCase(strDoctorCorreo);

        boolean existeRne = existeRne(dtoRne);
        boolean existeCpm = existeCpm(dtoCpm);
        boolean existeDni = personaServicio.existePersonaDni(dtoDni);
        boolean existeCorreo = personaServicio.existePersonaCorreo(dtoCorreo);

        if (!valRne && existeRne){
            throw new DataIntegrityViolationException("El RNE ya se encuentra en la entidad");
        }

        if (!valCpm && existeCpm){
            throw new DataIntegrityViolationException("El CPM ya existe en la entidad");
        }

        if (!valDni && existeDni){
            throw new DataIntegrityViolationException("El dni ya existe en la entidad");
        }

        if (!valCorreo && existeCorreo){
            throw new DataIntegrityViolationException("El correo ya existe en la entidad");
        }

        Especialidad especialidad = especialidadMapper.especialidadRefDtoToEspecialidad(dto.getEspecialidad());

        doctor.setEspecialidad(especialidad);

        doctorMapper.updateFromDto(dto,doctor);

        personaMapper.updateFromDto(dto.getPersona(),doctor.getPersona());

        return doctorMapper.toDto(doctor);
    }

    @Transactional(readOnly = true)
    @Override
    public DoctorEspecialidadLeerDTO leerPorId(Integer id) {
        return doctorRepositorio.todosDoctoresEspecialidadesPorId(id)
                .orElseThrow( ()-> new EntityNotFoundException("No existe el doctor solicitado")
        );
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        if (!existeDoctor(id)){
            throw new EntityNotFoundException("No existe el doctor que deseas eliminar");
        }

        doctorRepositorio.DoctorCambiarEstado(0,id);

    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidad() {
        return doctorRepositorio.todosDoctoresEspecialidades();
    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidadActivos() {
        return doctorRepositorio.todosDoctoresEspecialidadesActivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorEspecialidadLeerDTO> todosDoctoresEspecialidadInactivos() {
        return doctorRepositorio.todosDoctoresEspecialidadesInactivos();
    }

    @Transactional(readOnly = true)
    @Override
    public List<DoctorEspecialidadPorIdDTO> listaDoctoresEspecialidadSeleccionada(Integer id) {
        return doctorRepositorio.listaDoctoresEspecialidadSeleccionada(id);
    }

    @Transactional(readOnly = true)
    @Override
    public DoctorDetalleLeerDTO obtenerDatosPersonales(Integer id) {
        return doctorRepositorio.obtenerDetallePorId(id).orElseThrow(
                ()-> new EntityNotFoundException("El doctor que desea obtener, no esta registrado en el sistema")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeCpm(String cpm) {
        return doctorRepositorio.existsByCpm(cpm);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existeRne(String rne) {
        return doctorRepositorio.existsByRne(rne);
    }

    @Transactional(readOnly = true)
    @Override
    public List<NombreDoctoresDTO> listaNombreDoctoresDtos() {
        return doctorRepositorio.listarDoctoresResumen();
    }
}
