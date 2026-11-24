package com.salud.consultorio.impl;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoDatosBaseDTO;
import com.salud.consultorio.dto.descansoMedico.DescansoMedicoRespuestaDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import com.salud.consultorio.model.entity.DescansoMedico;
import com.salud.consultorio.model.entity.Medico;
import com.salud.consultorio.model.entity.Persona;
import org.springframework.stereotype.Component;

@Component
public class DescansoMedicoMapeador {

    /** Datos automáticos tomados de la atención (para el formulario). */
    public DescansoMedicoDatosBaseDTO datosBase(CitaMedica cita) {
        Persona paciente = cita.getPaciente().getPersona();
        Medico medico = cita.getMedico();
        return new DescansoMedicoDatosBaseDTO(
                nombreCompleto(paciente),
                documento(paciente),
                nombreCompleto(medico.getEmpleado().getPersona()),
                medico.getEspecialidad().getNombre(),
                medico.getNumeroColegiatura(),
                cita.getFechaCita());
    }

    /** Respuesta construida solo con lo que quedó firmado y guardado en el documento. */
    public DescansoMedicoRespuestaDTO respuesta(DescansoMedico d) {
        return new DescansoMedicoRespuestaDTO(
                d.getId(),
                d.getNumero(),
                d.getCodigoDocumento(),
                new DescansoMedicoDatosBaseDTO(
                        d.getPacienteNombre(),
                        d.getPacienteDocumento(),
                        d.getMedicoNombre(),
                        d.getMedicoEspecialidad(),
                        d.getMedicoColegiatura(),
                        d.getFechaAtencion()),
                d.getFechaInicio(),
                d.getFechaFin(),
                d.getDias(),
                d.getJustificacion(),
                d.getFechaEmision(),
                d.getMetodoConfirmacion(),
                d.getFechaConfirmacion(),
                d.getTipoFirma(),
                d.getAlgoritmoFirma(),
                d.getFirma(),
                d.getHashContenido());
    }

    public String nombreCompleto(Persona p) {
        return (p.getNombre() + " " + p.getApellidos()).trim();
    }

    // ADAPTAR: si TipoDocumento expone otro getter (p. ej. getAbreviatura()), cámbialo aquí.
    public String documento(Persona p) {
        return p.getTipoDocumento().getCodigo() + " " + p.getNumeroDocumento();
    }
}