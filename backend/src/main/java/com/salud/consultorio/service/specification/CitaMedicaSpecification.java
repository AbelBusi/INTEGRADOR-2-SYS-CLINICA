package com.salud.consultorio.service.specification;

import com.salud.consultorio.dto.citaMedica.CitaMedicaFiltroDTO;
import com.salud.consultorio.model.entity.CitaMedica;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public final class CitaMedicaSpecification {

    private static final LocalTime MEDIODIA = LocalTime.NOON;

    private CitaMedicaSpecification() {
    }


    public static Specification<CitaMedica> de(CitaMedicaFiltroDTO f, Integer personaMedico, Integer personaPaciente) {
        return (root, query, cb) -> {
            Class<?> tipo = query.getResultType();
            boolean esCount = Long.class.equals(tipo) || long.class.equals(tipo);

            Join<?, ?> paciente = unir(root, "paciente", esCount);
            Join<?, ?> pPersona = unir(paciente, "persona", esCount);
            Join<?, ?> medico = unir(root, "medico", esCount);
            Join<?, ?> empleado = unir(medico, "empleado", esCount);
            Join<?, ?> mPersona = unir(empleado, "persona", esCount);
            Join<?, ?> especialidad = unir(medico, "especialidad", esCount);
            Join<?, ?> usuario = unir(root, "usuario", esCount);

            List<Predicate> p = new ArrayList<>();

            p.add(cb.notEqual(root.get("estado"), 0));


            if (personaMedico != null) {
                p.add(cb.equal(mPersona.get("id"), personaMedico));
            }
            if (personaPaciente != null) {
                p.add(cb.equal(pPersona.get("id"), personaPaciente));
            }

            if (hayTexto(f.paciente())) {
                for (String token : f.paciente().trim().toLowerCase().split("\\s+")) {
                    String like = "%" + escapar(token) + "%";
                    p.add(cb.or(
                            cb.like(cb.lower(pPersona.get("nombre")), like, '\\'),
                            cb.like(cb.lower(pPersona.get("apellidos")), like, '\\'),
                            cb.like(cb.lower(pPersona.get("numeroDocumento")), like, '\\')));
                }
            }
            if (hayTexto(f.numeroDocumento())) {
                p.add(cb.like(cb.lower(pPersona.get("numeroDocumento")),
                        "%" + escapar(f.numeroDocumento().trim().toLowerCase()) + "%", '\\'));
            }
            if (f.idTipoDocumento() != null) {
                p.add(cb.equal(pPersona.get("tipoDocumento").get("idTipoDocumento"), f.idTipoDocumento()));
            }

            if (f.fecha() != null) {
                p.add(cb.equal(root.get("fechaCita"), f.fecha()));
            }
            if (f.fechaDesde() != null) {
                p.add(cb.greaterThanOrEqualTo(root.get("fechaCita"), f.fechaDesde()));
            }
            if (f.fechaHasta() != null) {
                p.add(cb.lessThanOrEqualTo(root.get("fechaCita"), f.fechaHasta()));
            }
            if (hayTexto(f.turno())) {
                if (f.turno().trim().toUpperCase().startsWith("MA")) {
                    p.add(cb.lessThan(root.get("horaInicio"), MEDIODIA));
                } else {
                    p.add(cb.greaterThanOrEqualTo(root.get("horaInicio"), MEDIODIA));
                }
            }
            if (f.horaDesde() != null) {
                p.add(cb.greaterThanOrEqualTo(root.get("horaInicio"), f.horaDesde()));
            }
            if (f.horaHasta() != null) {
                p.add(cb.lessThanOrEqualTo(root.get("horaInicio"), f.horaHasta()));
            }
            if (f.diaSemana() != null) {

                int mysql = f.diaSemana() % 7 + 1;
                p.add(cb.equal(cb.function("dayofweek", Integer.class, root.get("fechaCita")), mysql));
            }

            if (f.estado() != null && !f.estado().isEmpty()) {
                p.add(root.get("estado").in(f.estado().stream().filter(e -> e != null && e != 0).toList()));
            }
            if (Boolean.TRUE.equals(f.enAtencion())) {
                p.add(cb.equal(root.get("estado"), 1));
                p.add(cb.isNotNull(root.get("inicioAtencion")));
                p.add(cb.isNull(root.get("finAtencion")));
            }

            if (f.idEspecialidad() != null) {
                p.add(cb.equal(especialidad.get("id"), f.idEspecialidad()));
            }
            if (f.idMedico() != null) {
                p.add(cb.equal(medico.get("id"), f.idMedico()));
            }

            if (hayTexto(f.registradoPor())) {
                p.add(cb.like(cb.lower(usuario.get("usuario")),
                        "%" + escapar(f.registradoPor().trim().toLowerCase()) + "%", '\\'));
            }
            if (f.registroPresencial() != null) {
                p.add(cb.equal(usuario.get("registroPresencial"), f.registroPresencial()));
            }

            return cb.and(p.toArray(new Predicate[0]));
        };
    }

    private static Join<?, ?> unir(From<?, ?> from, String atributo, boolean esCount) {
        if (esCount) {
            return from.join(atributo, JoinType.INNER);
        }
        return (Join<?, ?>) from.fetch(atributo, JoinType.INNER);
    }

    private static boolean hayTexto(String s) {
        return s != null && !s.isBlank();
    }

    private static String escapar(String s) {
        return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}