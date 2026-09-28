package com.salud.consultorio.controller;

import com.salud.consultorio.dto.citaMedica.DoctorCitaAtendidaDTO;
import com.salud.consultorio.dto.doctor.*;
import com.salud.consultorio.model.entity.Doctor;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ICitaMedicaServicio;
import com.salud.consultorio.service.IDoctorServicio;
import jakarta.persistence.EntityNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/doctores")
@RequiredArgsConstructor
@Tag(
        name = "Doctores",
        description = "Endpoints para la gestión de doctores"
)
public class DoctorController {

    private final IDoctorServicio doctorServicio;
    private final ICitaMedicaServicio citaMedicaServicio;

    @Operation(summary = "Registrar un nuevo doctor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Doctor registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    @PreAuthorize("hasAuthority('DOCTOR_CREATE')")
    public ResponseEntity<MensajeResponse> crearDoctor(@Valid @RequestBody DoctorCrearDTO doctorCrearDTO){

        DoctorRespuestaDTO doctor =doctorServicio.crear(doctorCrearDTO);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor agregado con exito")
                .object(doctorCrearDTO).build(), HttpStatus.CREATED);

    }


    @Operation(summary = "Obtener el doctor del usuario autenticado")
    @GetMapping("/actual")
    public ResponseEntity<MensajeResponse> doctorActual(Authentication authentication){

        Doctor doctor = doctorServicio.obtenerPorUsuario(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("El usuario autenticado no es un doctor"));

        DoctorEspecialidadLeerDTO leer = doctorServicio.leerPorId(doctor.getId());

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor autenticado")
                .object(leer).build(), HttpStatus.OK);

    }

    @Operation(summary = "Listar los pacientes del doctor autenticado por estado de cita")
    @GetMapping("/mis-pacientes")
    public ResponseEntity<MensajeResponse> misPacientes(
            @RequestParam Integer estado,
            Authentication authentication){

        List<PacienteDoctorDTO> pacientes = citaMedicaServicio.pacientesDoctor(authentication.getName(), estado);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("PACIENTES DEL DOCTOR")
                .object(pacientes).build(), HttpStatus.OK);

    }

    @GetMapping("/{id}/citas-medicas")
    @PreAuthorize("hasAuthority('CITA_READ')")
    public ResponseEntity<MensajeResponse> traerCitasPorDoctor(
            @RequestParam(required = false, name = "estado") EntidadEstado estado,
            @PathVariable("id") Integer id){

        if (estado!=null){

            if (estado.equals(estado.EN_PROCESO)){
                List<DoctorCitaAtendidaDTO> cita = citaMedicaServicio.listarCitasAtendidasPorDoctor(id,1);
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE CITAS EN PROCESO POR DOCTOR")
                        .object(cita).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.CANCELADO)){

                List<DoctorCitaAtendidaDTO> cita = citaMedicaServicio.listarCitasAtendidasPorDoctor(id,0);
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE CITAS CANCELADAS POR DOCTOR")
                        .object(cita).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.ATENDIDO)){
                List<DoctorCitaAtendidaDTO> cita = citaMedicaServicio.listarCitasAtendidasPorDoctor(id,2);
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE CITAS ATENDIDAS POR DOCTOR")
                        .object(cita).build(),HttpStatus.OK);
            }

        }

        List<DoctorCitaAtendidaDTO> cita = citaMedicaServicio.listarCitasAtendidasPorDoctorHistorial(id);
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("HISTORIAL DE CITAS POR DOCTOR")
                .object(cita).build(),HttpStatus.OK);



    }


    @Operation(summary = "Listar nombres de doctores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de doctores obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "No existen doctores")
    })
    @GetMapping("/resumen")
    @PreAuthorize("hasAuthority('CITA_READ')")
    public ResponseEntity<MensajeResponse> listaNombres() {
        List<NombreDoctoresDTO> leerNombreDoctoresDTOS = doctorServicio.listaNombreDoctoresDtos();

        if (leerNombreDoctoresDTOS == null) {

            return new ResponseEntity<>(MensajeResponse.builder()
                    .mensaje("No existen doctores todavia")
                    .object(null).build(), HttpStatus.NOT_FOUND);

        }
        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE DOCTORES")
                .object(leerNombreDoctoresDTOS).build(), HttpStatus.OK);
    }


    @Operation(summary = "Listar doctores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de doctores obtenida correctamente")
    })
    @GetMapping
    @PreAuthorize("hasAuthority('CITA_READ')")
    public ResponseEntity<MensajeResponse> leerDoctores(
            @RequestParam(required = false,name = "estado") EntidadEstado estado){

        if (estado!=null){

            if (estado.equals(estado.ACTIVO)){
                List<DoctorEspecialidadLeerDTO> doctores =doctorServicio.todosDoctoresEspecialidadActivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE DOCTORES POR ESTADO ACTIVO")
                        .object(doctores).build(),HttpStatus.OK);
            }

            if (estado.equals(estado.INACTIVO)){
                List<DoctorEspecialidadLeerDTO> doctores =doctorServicio.todosDoctoresEspecialidadInactivos();
                return new ResponseEntity<>(MensajeResponse.builder()
                        .mensaje("LISTA DE DOCTORES POR ESTADO INACTIVO")
                        .object(doctores).build(),HttpStatus.OK);
            }

        }

        List<DoctorEspecialidadLeerDTO> doctores =doctorServicio.todosDoctoresEspecialidad();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE DOCTORES")
                .object(doctores).build(),HttpStatus.OK);

    }

    @Operation(summary = "Obtener doctor por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doctor encontrado"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CITA_READ')")
    public ResponseEntity<MensajeResponse> leerDoctorPorId(@PathVariable Integer id){

        DoctorDetalleLeerDTO leer = doctorServicio.obtenerDatosPersonales(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Informacion del doctor solicitado")
                .object(leer).build(),HttpStatus.OK);

    }

    @Operation(summary = "Actualizar doctor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Doctor actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MensajeResponse> actualizarDoctor(
            @PathVariable Integer id,
            @Valid @RequestBody DoctorActualizarDTO dto){

        DoctorRespuestaDTO respuesta = doctorServicio.actualizar(dto,id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor actualizado con exito")
                .object(respuesta).build(), HttpStatus.CREATED);

    }

    @Operation(summary = "Eliminar doctor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Doctor eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Doctor no encontrado")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CITA_DELETE')")
    public ResponseEntity<MensajeResponse> eliminarDoctorPorId(@PathVariable Integer id){

        doctorServicio.eliminarPorId(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Doctor eliminado con exito")
                .object(null).build(),HttpStatus.NO_CONTENT);

    }

    @Operation(summary = "Listar doctores por especialidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de doctores obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "Especialidad no encontrada")
    })
    @GetMapping("/especialidad/{id}")
    public ResponseEntity<MensajeResponse> especialidadId(@PathVariable Integer id){

        List<DoctorEspecialidadPorIdDTO> doctores = doctorServicio.listaDoctoresEspecialidadSeleccionada(id);

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("LISTA DE DOCTORES POR ESPECIALIDAD SELECCIONADA")
                .object(doctores).build(),HttpStatus.OK);
    }

}