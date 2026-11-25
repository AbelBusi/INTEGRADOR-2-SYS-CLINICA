package com.salud.consultorio.model.entity;

import com.salud.consultorio.model.enums.ResultadoAuditoriaDescanso;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Immutable
@Entity
@Table(name = "auditoria_descanso_medico")
public class AuditoriaDescansoMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria_descanso", updatable = false)
    private Integer id;

    /** Nulo cuando la operación fue rechazada y no se generó documento. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_descanso_medico", updatable = false)
    private DescansoMedico descansoMedico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cita_medica", nullable = false, updatable = false)
    private CitaMedica citaMedica;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_paciente", nullable = false, updatable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_medico", nullable = false, updatable = false)
    private Medico medico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, updatable = false)
    private Usuario usuario;

    @Column(name = "fecha_evento", nullable = false, updatable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "ip_origen", length = 45, updatable = false)
    private String ipOrigen;

    @Column(name = "codigo_documento", length = 36, updatable = false)
    private String codigoDocumento;

    @Column(name = "hash_contenido", length = 64, updatable = false)
    private String hashContenido;

    @Column(name = "fecha_inicio", updatable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", updatable = false)
    private LocalDate fechaFin;

    @Column(name = "dias", updatable = false)
    private Integer dias;

    @Column(name = "justificacion", length = 1000, updatable = false)
    private String justificacion;

    @Column(name = "observacion", length = 500, updatable = false)
    private String observacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado", nullable = false, length = 20, updatable = false)
    private ResultadoAuditoriaDescanso resultado;
}