package com.salud.consultorio.impl;

import com.salud.consultorio.dto.descansoMedico.DescansoMedicoVerificacionDTO;
import com.salud.consultorio.model.entity.DescansoMedico;
import com.salud.consultorio.repository.ICancelacionDescansoMedicoRepositorio;
import com.salud.consultorio.repository.IDescansoMedicoRepositorio;
import com.salud.consultorio.service.IDescansoMedicoVerificacionServicio;
import com.salud.consultorio.service.IFirmaElectronicaServicio;
import com.salud.consultorio.service.IFirmaElectronicaServicio.DatosFirma;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DescansoMedicoVerificacionServicioImpl implements IDescansoMedicoVerificacionServicio {

    private static final Pattern UUID_PATRON =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private final IDescansoMedicoRepositorio descansoRepositorio;
    private final ICancelacionDescansoMedicoRepositorio cancelacionRepositorio;
    private final IFirmaElectronicaServicio firmaServicio;

    @Override
    @Transactional(readOnly = true)
    public DescansoMedicoVerificacionDTO verificar(String codigoDocumento) {
        if (codigoDocumento == null || !UUID_PATRON.matcher(codigoDocumento).matches()) {
            return noEncontrado();
        }

        var encontrado = descansoRepositorio.findByCodigoDocumento(codigoDocumento.toLowerCase(Locale.ROOT));
        if (encontrado.isEmpty()) {
            return noEncontrado();
        }

        DescansoMedico d = encontrado.get();

        // Se recalcula la firma con lo almacenado: si algo cambió, no coincide.
        boolean integra = firmaServicio.verificar(new DatosFirma(
                d.getCodigoDocumento(), d.getNumero(), d.getCitaMedica().getId(),
                d.getPaciente().getId(), d.getPacienteDocumento(),
                d.getMedico().getId(), d.getMedicoNombre(), d.getMedicoColegiatura(), d.getMedicoEspecialidad(),
                d.getFechaAtencion(), d.getFechaInicio(), d.getFechaFin(), d.getDias(),
                d.getJustificacion(), d.getFechaEmision(), d.getMetodoConfirmacion()), d.getFirma());

        var cancelacion = cancelacionRepositorio.findByDescansoMedico_Id(d.getId());

        String estado = !integra ? "ALTERADO" : cancelacion.isPresent() ? "CANCELADO" : "VIGENTE";

        return new DescansoMedicoVerificacionDTO(
                estado,
                d.getNumero(),
                d.getFechaEmision(),
                d.getFechaInicio(),
                d.getFechaFin(),
                d.getDias(),
                d.getMedicoNombre(),
                d.getMedicoEspecialidad(),
                d.getMedicoColegiatura(),
                enmascararNombre(d.getPacienteNombre()),
                enmascararDocumento(d.getPacienteDocumento()),
                d.getHashContenido(),
                d.getTipoFirma(),
                integra,
                cancelacion.map(c -> c.getFechaCancelacion()).orElse(null));
    }

    private DescansoMedicoVerificacionDTO noEncontrado() {
        return new DescansoMedicoVerificacionDTO("NO_ENCONTRADO", null, null, null, null, null,
                null, null, null, null, null, null, null, false, null);
    }

    /** JHON ALBERTO HERNANDEZ -> J*** A*** H*** */
    private String enmascararNombre(String nombre) {
        return Arrays.stream(nombre.trim().split("\\s+"))
                .map(palabra -> palabra.charAt(0) + "***")
                .collect(Collectors.joining(" "));
    }

    /** DNI 74770191 -> DNI 74****91 */
    private String enmascararDocumento(String documento) {
        int separador = documento.lastIndexOf(' ');
        String tipo = separador < 0 ? "" : documento.substring(0, separador + 1);
        String numero = separador < 0 ? documento : documento.substring(separador + 1);

        if (numero.length() <= 4) {
            return tipo + "****";
        }
        return tipo + numero.substring(0, 2) + "*".repeat(numero.length() - 4)
                + numero.substring(numero.length() - 2);
    }
}