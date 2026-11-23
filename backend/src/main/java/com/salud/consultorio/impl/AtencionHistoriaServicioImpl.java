package com.salud.consultorio.impl;

import com.salud.consultorio.dto.historiaClinica.*;
import com.salud.consultorio.model.entity.*;
import com.salud.consultorio.repository.IAtencionHistoriaRepositorio;
import com.salud.consultorio.service.IAtencionHistoriaServicio;
import com.salud.consultorio.service.IHistoriaClinicaAccesoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtencionHistoriaServicioImpl implements IAtencionHistoriaServicio {

    private static final int TAMANIO_MAXIMO = 50;

    private final IAtencionHistoriaRepositorio atencionRepositorio;
    private final IHistoriaClinicaAccesoServicio accesoServicio;

    @Transactional(readOnly = true)
    @Override
    public PaginaDTO<AtencionHistoriaDTO> listarPorPaciente(Integer idPaciente, int pagina, int tamanio) {

        accesoServicio.medicoAutorizadoPara(idPaciente);

        return construir(idPaciente, pagina, tamanio);

    }

    @Transactional(readOnly = true)
    @Override
    public PaginaDTO<AtencionHistoriaDTO> listarMias(int pagina, int tamanio) {

        Paciente paciente = accesoServicio.pacienteTitular();

        return construir(paciente.getId(), pagina, tamanio);

    }

    private PaginaDTO<AtencionHistoriaDTO> construir(Integer idPaciente, int pagina, int tamanio) {

        Page<CitaMedica> citas = atencionRepositorio.atendidasPorPaciente(
                idPaciente,
                PageRequest.of(Math.max(pagina, 0), Math.min(Math.max(tamanio, 1), TAMANIO_MAXIMO))
        );

        List<Integer> idsCita = citas.getContent().stream().map(CitaMedica::getId).toList();

        List<Diagnostico> diagnosticos = idsCita.isEmpty()
                ? List.of() : atencionRepositorio.diagnosticosDeCitas(idsCita);

        List<Integer> idsDiagnostico = diagnosticos.stream().map(Diagnostico::getId).toList();

        List<Tratamiento> tratamientos = idsDiagnostico.isEmpty()
                ? List.of() : atencionRepositorio.tratamientosDe(idsDiagnostico);
        List<Indicacion> indicaciones = idsDiagnostico.isEmpty()
                ? List.of() : atencionRepositorio.indicacionesDe(idsDiagnostico);
        List<Derivacion> derivaciones = idsDiagnostico.isEmpty()
                ? List.of() : atencionRepositorio.derivacionesDe(idsDiagnostico);

        Map<Integer, List<Diagnostico>> diagnosticosPorCita = agrupar(diagnosticos, d -> d.getCitaMedica().getId());
        Map<Integer, List<Tratamiento>> tratamientosPorDiagnostico = agrupar(tratamientos, t -> t.getDiagnostico().getId());
        Map<Integer, List<Indicacion>> indicacionesPorDiagnostico = agrupar(indicaciones, i -> i.getDiagnostico().getId());
        Map<Integer, List<Derivacion>> derivacionesPorDiagnostico = agrupar(derivaciones, v -> v.getDiagnostico().getId());

        List<AtencionHistoriaDTO> contenido = citas.getContent().stream()
                .map(cita -> toDto(
                        cita,
                        diagnosticosPorCita.getOrDefault(cita.getId(), List.of()),
                        tratamientosPorDiagnostico,
                        indicacionesPorDiagnostico,
                        derivacionesPorDiagnostico
                ))
                .toList();

        return new PaginaDTO<>(contenido, citas.getNumber(), citas.getSize(),
                citas.getTotalElements(), citas.getTotalPages());

    }

    private AtencionHistoriaDTO toDto(CitaMedica cita, List<Diagnostico> diagnosticos,
                                      Map<Integer, List<Tratamiento>> tratamientos,
                                      Map<Integer, List<Indicacion>> indicaciones,
                                      Map<Integer, List<Derivacion>> derivaciones) {

        Persona persona = cita.getMedico().getEmpleado().getPersona();

        return new AtencionHistoriaDTO(
                cita.getId(),
                cita.getFechaCita(),
                cita.getHoraInicio(),
                cita.getHoraSalida(),
                cita.getInicioAtencion(),
                cita.getFinAtencion(),
                cita.getMedico().getId(),
                persona.getNombre() + " " + persona.getApellidos(),
                cita.getMedico().getEspecialidad().getNombre(),
                cita.getMotivo(),
                diagnosticos.stream().map(d -> new DiagnosticoAtencionDTO(
                        d.getId(),
                        d.getCodigo(),
                        d.getDescripcion(),
                        d.getTipoDiagnostico(),
                        d.getObservaciones(),
                        d.getFecDiagnostico(),
                        tratamientos.getOrDefault(d.getId(), List.of()).stream()
                                .map(t -> new TratamientoAtencionDTO(
                                        t.getId(), t.getNombreMedicamento(), t.getDosis(),
                                        t.getViaAdministracion(), t.getFrecuencia(),
                                        t.getDuracionDias(), t.getTotCantidad(), t.getDescIndicacion()))
                                .toList(),
                        indicaciones.getOrDefault(d.getId(), List.of()).stream()
                                .map(i -> new IndicacionAtencionDTO(
                                        i.getId(), i.getTipoIndicacion(), i.getDescripcion(),
                                        i.getDiasReposo(), i.getFrecuencia()))
                                .toList(),
                        derivaciones.getOrDefault(d.getId(), List.of()).stream()
                                .map(v -> new DerivacionAtencionDTO(
                                        v.getId(), v.getCodigo(), v.getEspecialidad().getNombre(),
                                        v.getMotivo(), v.getUrgencia(), v.getFechaDerivacion()))
                                .toList()
                )).toList()
        );

    }

    private <T> Map<Integer, List<T>> agrupar(List<T> lista, Function<T, Integer> clave) {
        return lista.stream().collect(Collectors.groupingBy(clave));
    }

}