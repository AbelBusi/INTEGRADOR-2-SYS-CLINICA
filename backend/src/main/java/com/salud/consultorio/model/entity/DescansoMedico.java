package com.salud.consultorio.model.entity;

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
@Table(name = "descanso_medico")
public class DescansoMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_descanso_medico", updatable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cita_medica", nullable = false, unique = true, updatable = false)
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

    @Column(name = "numero", nullable = false, length = 20, unique = true, updatable = false)
    private String numero;

    @Column(name = "codigo_documento", nullable = false, length = 36, unique = true, updatable = false)
    private String codigoDocumento;

    @Column(name = "paciente_nombre", nullable = false, length = 170, updatable = false)
    private String pacienteNombre;

    @Column(name = "paciente_documento", nullable = false, length = 30, updatable = false)
    private String pacienteDocumento;

    @Column(name = "medico_nombre", nullable = false, length = 170, updatable = false)
    private String medicoNombre;

    @Column(name = "medico_especialidad", nullable = false, length = 150, updatable = false)
    private String medicoEspecialidad;

    @Column(name = "medico_colegiatura", length = 20, updatable = false)
    private String medicoColegiatura;

    @Column(name = "fecha_atencion", nullable = false, updatable = false)
    private LocalDate fechaAtencion;

    @Column(name = "fecha_inicio", nullable = false, updatable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false, updatable = false)
    private LocalDate fechaFin;

    @Column(name = "dias", nullable = false, updatable = false)
    private Integer dias;

    @Column(name = "justificacion", nullable = false, length = 1000, updatable = false)
    private String justificacion;

    @Column(name = "fecha_emision", nullable = false, updatable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "metodo_confirmacion", nullable = false, length = 30, updatable = false)
    private String metodoConfirmacion;

    @Column(name = "fecha_confirmacion", nullable = false, updatable = false)
    private LocalDateTime fechaConfirmacion;

    @Column(name = "tipo_firma", nullable = false, length = 30, updatable = false)
    private String tipoFirma;

    @Column(name = "algoritmo_firma", nullable = false, length = 30, updatable = false)
    private String algoritmoFirma;

    @Column(name = "firma", nullable = false, length = 128, updatable = false)
    private String firma;

    @Column(name = "hash_contenido", nullable = false, length = 64, updatable = false)
    private String hashContenido;
}