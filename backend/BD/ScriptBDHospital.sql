-- =====================================================================
-- Proyecto: Hospital Jose Olaya
-- =====================================================================
CREATE DATABASE IF NOT EXISTS SISHPTL
    CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

-- ---------------------------------------------------------------------
-- Tablas catálogo (sin dependencias)
-- ---------------------------------------------------------------------

CREATE TABLE tipo_documento
(
    id_tipo_documento INT         NOT NULL AUTO_INCREMENT,
    codigo            VARCHAR(10) NOT NULL,
    descripcion       VARCHAR(60) NOT NULL,
    longitud           INT NOT NULL,
    estado            INT         NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_tipo_documento` PRIMARY KEY (id_tipo_documento),
    CONSTRAINT `unq_tipo_documento_codigo` UNIQUE (codigo)
) ENGINE = InnoDB;

CREATE TABLE especialidad
(
    id_especialidad INT          NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(60)  NOT NULL,
    descripcion     VARCHAR(200) NOT NULL,
    estado          INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_especialidad` PRIMARY KEY (id_especialidad),
    CONSTRAINT `unq_especialidad_nombre` UNIQUE (nombre)
) ENGINE = InnoDB;

CREATE TABLE rol
(
    id_rol      INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(40)  NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    estado      INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_rol` PRIMARY KEY (id_rol),
    CONSTRAINT `unq_rol_nombre` UNIQUE (nombre)
) ENGINE = InnoDB;

CREATE TABLE permiso
(
    id_permiso  INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(60)  NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    codigo      VARCHAR(60) NOT NULL,
    modulo      VARCHAR(60)  NOT NULL,
    estado      INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_permiso` PRIMARY KEY (id_permiso),
    CONSTRAINT `unq_permiso_nombre` UNIQUE (nombre)
) ENGINE = InnoDB;

INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver especialidades',
        'Permite visualizar las especialidades médicas registradas',
        'ESPECIALIDADES'
    ),
    (
        'Crear especialidad',
        'Permite registrar nuevas especialidades médicas',
        'ESPECIALIDADES'
    ),
    (
        'Editar especialidad',
        'Permite modificar la información de una especialidad médica',
        'ESPECIALIDADES'
    ),
    (
        'Eliminar especialidad',
        'Permite eliminar una especialidad médica',
        'ESPECIALIDADES'
    ),
    (
        'Cambiar estado de especialidad',
        'Permite activar o desactivar una especialidad médica',
        'ESPECIALIDADES'
    );

INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver cargos',
        'Permite visualizar los cargos registrados',
        'CARGOS'
    ),
    (
        'Crear cargo',
        'Permite registrar nuevos cargos y definir si corresponden a personal médico',
        'CARGOS'
    ),
    (
        'Editar cargo',
        'Permite modificar la información y la clasificación de un cargo',
        'CARGOS'
    ),
    (
        'Eliminar cargo',
        'Permite eliminar un cargo registrado',
        'CARGOS'
    ),
    (
        'Cambiar estado de cargo',
        'Permite activar o desactivar un cargo',
        'CARGOS'
    );
INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver pacientes',
        'Permite visualizar y consultar los pacientes registrados',
        'PACIENTES'
    ),
    (
        'Crear paciente',
        'Permite registrar nuevos pacientes',
        'PACIENTES'
    ),
    (
        'Editar paciente',
        'Permite modificar la información de los pacientes registrados',
        'PACIENTES'
    ),
    (
        'Eliminar paciente',
        'Permite eliminar un paciente registrado',
        'PACIENTES'
    ),
    (
        'Cambiar estado de paciente',
        'Permite activar o desactivar un paciente',
        'PACIENTES'
    );

INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver empleados',
        'Permite visualizar y consultar los empleados registrados',
        'EMPLEADOS'
    ),
    (
        'Crear empleado',
        'Permite registrar nuevos empleados',
        'EMPLEADOS'
    ),
    (
        'Editar empleado',
        'Permite modificar la información de los empleados registrados',
        'EMPLEADOS'
    ),
    (
        'Eliminar empleado',
        'Permite eliminar un empleado registrado',
        'EMPLEADOS'
    ),
    (
        'Cambiar estado de empleado',
        'Permite activar o desactivar un empleado',
        'EMPLEADOS'
    );

INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver médicos',
        'Permite visualizar y consultar los médicos registrados',
        'MÉDICOS'
    ),
    (
        'Crear médico',
        'Permite registrar nuevos médicos y asociarlos a una especialidad',
        'MÉDICOS'
    ),
    (
        'Editar médico',
        'Permite modificar la información de los médicos registrados',
        'MÉDICOS'
    ),
    (
        'Eliminar médico',
        'Permite eliminar un médico registrado',
        'MÉDICOS'
    ),
    (
        'Cambiar estado de médico',
        'Permite activar o desactivar un médico',
        'MÉDICOS'
    );

INSERT INTO permiso (nombre, descripcion, modulo)
VALUES
    (
        'Ver horarios',
        'Permite visualizar y consultar los horarios de atención registrados',
        'HORARIOS'
    ),
    (
        'Crear horario',
        'Permite registrar nuevos horarios de atención para los empleados',
        'HORARIOS'
    ),
    (
        'Editar horario',
        'Permite modificar los horarios de atención registrados',
        'HORARIOS'
    ),
    (
        'Eliminar horario',
        'Permite eliminar un horario de atención registrado',
        'HORARIOS'
    ),
    (
        'Cambiar estado de horario',
        'Permite activar o desactivar un horario de atención',
        'HORARIOS'
    );

INSERT INTO permiso (nombre, descripcion, modulo, codigo)
VALUES
    (
        'Ver roles',
        'Permite visualizar y consultar los roles registrados',
        'ROLES',
        'ROL_VER'
    ),
    (
        'Crear rol',
        'Permite registrar nuevos roles en el sistema',
        'ROLES',
        'ROL_CREAR'
    ),
    (
        'Editar rol',
        'Permite modificar la información de los roles registrados',
        'ROLES',
        'ROL_EDITAR'
    ),
    (
        'Eliminar rol',
        'Permite eliminar un rol registrado',
        'ROLES',
        'ROL_ELIMINAR'
    ),
    (
        'Cambiar estado de rol',
        'Permite activar o desactivar un rol registrado',
        'ROLES',
        'ROL_CAMBIAR_ESTADO'
    );

INSERT INTO permiso (nombre, descripcion, modulo, codigo)
VALUES
    (
        'Ver permisos de rol',
        'Permite visualizar los permisos asignados a un rol',
        'ROLES',
        'ROL_PERMISOS_VER'
    ),
    (
        'Asignar permisos a rol',
        'Permite asignar permisos disponibles a un rol registrado',
        'ROLES',
        'ROL_PERMISOS_ASIGNAR'
    );

INSERT INTO permiso (nombre, descripcion, modulo, codigo)
VALUES
    (
        'Crear usuario',
        'Permite registrar nuevos usuarios en el sistema',
        'USUARIOS',
        'USUARIO_CREAR'
    ),
    (
        'Cambiar rol de usuario',
        'Permite modificar el rol asignado a un usuario registrado',
        'USUARIOS',
        'USUARIO_CAMBIAR_ROL'
    ),
    (
        'Cambiar estado de usuario',
        'Permite activar o desactivar un usuario registrado',
        'USUARIOS',
        'USUARIO_CAMBIAR_ESTADO'
    );

-- esto es permisos para pacientes


INSERT INTO permiso (nombre, descripcion, modulo, codigo)
SELECT nuevos.nombre, nuevos.descripcion, nuevos.modulo, nuevos.codigo
FROM (
         SELECT
             'Ver mis citas' AS nombre,
             'Permite consultar las citas médicas del paciente autenticado, sus fechas, médicos asignados y estados' AS descripcion,
             'CITAS' AS modulo,
             'CITA_PACIENTE_VER' AS codigo

         UNION ALL SELECT
                       'Solicitar cita médica',
                       'Permite solicitar una cita médica para el paciente autenticado según la disponibilidad existente',
                       'CITAS',
                       'CITA_PACIENTE_CREAR'

         UNION ALL SELECT
                       'Cancelar mi cita',
                       'Permite solicitar o realizar la cancelación de citas propias según las reglas del establecimiento',
                       'CITAS',
                       'CITA_PACIENTE_CANCELAR'

         UNION ALL SELECT
                       'Ver mi historial clínico',
                       'Permite consultar el historial clínico propio según las autorizaciones aplicables',
                       'HISTORIAL_CLINICO',
                       'HISTORIAL_CLINICO_PROPIO_VER'

         UNION ALL SELECT
                       'Ver mis diagnósticos',
                       'Permite consultar los diagnósticos registrados en las atenciones del paciente autenticado',
                       'DIAGNOSTICOS',
                       'DIAGNOSTICO_PROPIO_VER'

         UNION ALL SELECT
                       'Ver mis tratamientos',
                       'Permite consultar los tratamientos indicados al paciente autenticado',
                       'TRATAMIENTOS',
                       'TRATAMIENTO_PROPIO_VER'

         UNION ALL SELECT
                       'Ver mis indicaciones médicas',
                       'Permite consultar las indicaciones médicas registradas para el paciente autenticado',
                       'INDICACIONES',
                       'INDICACION_PROPIA_VER'

         UNION ALL SELECT
                       'Ver mis recetas médicas',
                       'Permite consultar las recetas médicas emitidas al paciente autenticado',
                       'RECETAS',
                       'RECETA_PROPIA_VER'

         UNION ALL SELECT
                       'Ver mi perfil',
                       'Permite consultar los datos personales de la cuenta del paciente autenticado',
                       'PERFIL',
                       'PERFIL_PROPIO_VER'

         UNION ALL SELECT
                       'Editar mi perfil',
                       'Permite actualizar los datos personales autorizados del paciente autenticado',
                       'PERFIL',
                       'PERFIL_PROPIO_EDITAR'

         UNION ALL SELECT
                       'Ver mis atenciones',
                       'Permite consultar las atenciones médicas propias registradas en el establecimiento',
                       'ATENCIONES',
                       'ATENCION_PROPIA_VER'
     ) AS nuevos
WHERE NOT EXISTS (
    SELECT 1
    FROM permiso p
    WHERE p.codigo = nuevos.codigo
);


INSERT INTO autorizacion (id_rol, id_permiso, estado)
SELECT 4, p.id_permiso, 1
FROM permiso p
WHERE p.codigo IN (
                   'CITA_PACIENTE_VER',
                   'CITA_PACIENTE_CREAR',
                   'CITA_PACIENTE_CANCELAR',
                   'HISTORIAL_CLINICO_PROPIO_VER',
                   'DIAGNOSTICO_PROPIO_VER',
                   'TRATAMIENTO_PROPIO_VER',
                   'INDICACION_PROPIA_VER',
                   'RECETA_PROPIA_VER',
                   'PERFIL_PROPIO_VER',
                   'PERFIL_PROPIO_EDITAR',
                   'ATENCION_PROPIA_VER'
    )
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 4
      AND a.id_permiso = p.id_permiso
);


-- esto es permisos para recepcionista

INSERT INTO permiso (nombre, descripcion, modulo, codigo)
SELECT nuevos.nombre, nuevos.descripcion, nuevos.modulo, nuevos.codigo
FROM (
         SELECT
             'Ver citas' AS nombre,
             'Permite consultar las citas médicas registradas en el establecimiento' AS descripcion,
             'CITAS' AS modulo,
             'CITA_VER' AS codigo

         UNION ALL SELECT
                       'Agendar cita',
                       'Permite registrar citas médicas para los pacientes con médicos disponibles',
                       'CITAS',
                       'CITA_CREAR'

         UNION ALL SELECT
                       'Editar cita',
                       'Permite modificar la fecha, hora, médico y otros datos de una cita',
                       'CITAS',
                       'CITA_EDITAR'

         UNION ALL SELECT
                       'Cancelar cita',
                       'Permite cancelar citas médicas registradas según las reglas del sistema',
                       'CITAS',
                       'CITA_CANCELAR'

         UNION ALL SELECT
                       'Confirmar cita',
                       'Permite confirmar la asistencia o confirmación administrativa de una cita',
                       'CITAS',
                       'CITA_CONFIRMAR'

         UNION ALL SELECT
                       'Cambiar estado de cita',
                       'Permite actualizar el estado administrativo de una cita médica',
                       'CITAS',
                       'CITA_CAMBIAR_ESTADO'

         UNION ALL SELECT
                       'Consultar disponibilidad médica',
                       'Permite consultar los médicos y horarios disponibles para agendar citas',
                       'CITAS',
                       'CITA_VER_DISPONIBILIDAD'

         UNION ALL SELECT
                       'Ver reportes de citas',
                       'Permite consultar reportes administrativos de citas médicas',
                       'REPORTES',
                       'REPORTE_CITAS_VER'

         UNION ALL SELECT
                       'Generar reportes de citas',
                       'Permite generar reportes de citas por fecha, médico, estado y otros criterios',
                       'REPORTES',
                       'REPORTE_CITAS_GENERAR'
     ) AS nuevos
WHERE NOT EXISTS (
    SELECT 1
    FROM permiso p
    WHERE p.codigo = nuevos.codigo
);


INSERT INTO autorizacion (id_rol, id_permiso, estado)
SELECT 3, p.id_permiso, 1
FROM permiso p
WHERE p.codigo IN (
    -- Permisos existentes
                   'PACIENTE_VER',
                   'PACIENTE_CREAR',
                   'PACIENTE_EDITAR',
                   'MEDICO_VER',
                   'HORARIO_VER',

    -- Gestión de citas
                   'CITA_VER',
                   'CITA_CREAR',
                   'CITA_EDITAR',
                   'CITA_CANCELAR',
                   'CITA_CONFIRMAR',
                   'CITA_CAMBIAR_ESTADO',
                   'CITA_VER_DISPONIBILIDAD',

    -- Reportes
                   'REPORTE_CITAS_VER',
                   'REPORTE_CITAS_GENERAR'
    )
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 3
      AND a.id_permiso = p.id_permiso
);


-- esto es permisos para medicos

INSERT INTO permiso (nombre, descripcion, modulo, codigo)
SELECT nuevos.nombre, nuevos.descripcion, nuevos.modulo, nuevos.codigo
FROM (
         SELECT
             'Ver citas asignadas' AS nombre,
             'Permite visualizar las citas médicas asignadas al médico autenticado' AS descripcion,
             'CITAS' AS modulo,
             'CITA_VER_PROPIAS' AS codigo

         UNION ALL

         SELECT
             'Ver pacientes asignados',
             'Permite consultar los pacientes que debe atender según sus citas asignadas',
             'PACIENTES',
             'PACIENTE_VER_ASIGNADOS'

         UNION ALL

         SELECT
             'Ver horario propio',
             'Permite consultar el horario de atención del médico autenticado',
             'HORARIOS',
             'HORARIO_VER_PROPIO'

         UNION ALL

         SELECT
             'Marcar cita como atendida',
             'Permite registrar que una cita asignada ha sido atendida',
             'CITAS',
             'CITA_MARCAR_ATENDIDA'

         UNION ALL

         SELECT
             'Registrar inasistencia',
             'Permite registrar la inasistencia de un paciente a una cita asignada',
             'CITAS',
             'CITA_REGISTRAR_INASISTENCIA'

         UNION ALL

         SELECT
             'Ver diagnósticos',
             'Permite consultar los diagnósticos de los pacientes que atiende',
             'DIAGNOSTICOS',
             'DIAGNOSTICO_VER'

         UNION ALL

         SELECT
             'Crear diagnóstico',
             'Permite registrar diagnósticos médicos durante la atención',
             'DIAGNOSTICOS',
             'DIAGNOSTICO_CREAR'

         UNION ALL

         SELECT
             'Editar diagnóstico',
             'Permite modificar diagnósticos médicos de las atenciones autorizadas',
             'DIAGNOSTICOS',
             'DIAGNOSTICO_EDITAR'

         UNION ALL

         SELECT
             'Eliminar diagnóstico',
             'Permite eliminar diagnósticos según las reglas clínicas del sistema',
             'DIAGNOSTICOS',
             'DIAGNOSTICO_ELIMINAR'

         UNION ALL

         SELECT
             'Ver tratamientos',
             'Permite consultar los tratamientos registrados en las atenciones de sus pacientes',
             'TRATAMIENTOS',
             'TRATAMIENTO_VER'

         UNION ALL

         SELECT
             'Indicar tratamiento',
             'Permite prescribir tratamientos durante una atención médica',
             'TRATAMIENTOS',
             'TRATAMIENTO_INDICAR'

         UNION ALL

         SELECT
             'Editar tratamiento',
             'Permite modificar tratamientos de las atenciones autorizadas',
             'TRATAMIENTOS',
             'TRATAMIENTO_EDITAR'

         UNION ALL

         SELECT
             'Registrar indicaciones médicas',
             'Permite registrar recomendaciones e indicaciones para el paciente',
             'INDICACIONES',
             'INDICACION_CREAR'

         UNION ALL

         SELECT
             'Editar indicaciones médicas',
             'Permite modificar indicaciones de sus atenciones',
             'INDICACIONES',
             'INDICACION_EDITAR'

         UNION ALL

         SELECT
             'Ver historial clínico',
             'Permite consultar el historial clínico de los pacientes que atiende',
             'HISTORIAL_CLINICO',
             'HISTORIAL_CLINICO_VER'

         UNION ALL

         SELECT
             'Registrar observaciones médicas',
             'Permite registrar observaciones clínicas durante una atención',
             'ATENCIONES',
             'ATENCION_OBSERVACION_CREAR'
     ) AS nuevos
WHERE NOT EXISTS (
    SELECT 1
    FROM permiso p
    WHERE p.codigo = nuevos.codigo
);



INSERT INTO autorizacion (id_rol, id_permiso, estado)
SELECT 2, p.id_permiso, 1
FROM permiso p
WHERE p.codigo IN (
                   'MEDICO_VER',
                   'CITA_VER_PROPIAS',
                   'PACIENTE_VER_ASIGNADOS',
                   'HORARIO_VER_PROPIO',
                   'CITA_MARCAR_ATENDIDA',
                   'CITA_REGISTRAR_INASISTENCIA',
                   'DIAGNOSTICO_VER',
                   'DIAGNOSTICO_CREAR',
                   'DIAGNOSTICO_EDITAR',
                   'DIAGNOSTICO_ELIMINAR',
                   'TRATAMIENTO_VER',
                   'TRATAMIENTO_INDICAR',
                   'TRATAMIENTO_EDITAR',
                   'INDICACION_CREAR',
                   'INDICACION_EDITAR',
                   'HISTORIAL_CLINICO_VER',
                   'ATENCION_OBSERVACION_CREAR'
    )
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 2
      AND a.id_permiso = p.id_permiso
);



UPDATE permiso
SET codigo = CASE id_permiso
                 WHEN 1  THEN 'USUARIOS_GESTIONAR'

                 WHEN 2  THEN 'ESPECIALIDAD_VER'
                 WHEN 3  THEN 'ESPECIALIDAD_CREAR'
                 WHEN 4  THEN 'ESPECIALIDAD_EDITAR'
                 WHEN 5  THEN 'ESPECIALIDAD_ELIMINAR'
                 WHEN 6  THEN 'ESPECIALIDAD_CAMBIAR_ESTADO'

                 WHEN 7  THEN 'CARGO_VER'
                 WHEN 8  THEN 'CARGO_CREAR'
                 WHEN 9  THEN 'CARGO_EDITAR'
                 WHEN 10 THEN 'CARGO_ELIMINAR'
                 WHEN 11 THEN 'CARGO_CAMBIAR_ESTADO'

                 WHEN 12 THEN 'PACIENTE_VER'
                 WHEN 13 THEN 'PACIENTE_CREAR'
                 WHEN 14 THEN 'PACIENTE_EDITAR'
                 WHEN 15 THEN 'PACIENTE_ELIMINAR'
                 WHEN 16 THEN 'PACIENTE_CAMBIAR_ESTADO'

                 WHEN 17 THEN 'EMPLEADO_VER'
                 WHEN 18 THEN 'EMPLEADO_CREAR'
                 WHEN 19 THEN 'EMPLEADO_EDITAR'
                 WHEN 20 THEN 'EMPLEADO_ELIMINAR'
                 WHEN 21 THEN 'EMPLEADO_CAMBIAR_ESTADO'

                 WHEN 22 THEN 'MEDICO_VER'
                 WHEN 23 THEN 'MEDICO_CREAR'
                 WHEN 24 THEN 'MEDICO_EDITAR'
                 WHEN 25 THEN 'MEDICO_ELIMINAR'
                 WHEN 26 THEN 'MEDICO_CAMBIAR_ESTADO'

                 WHEN 27 THEN 'HORARIO_VER'
                 WHEN 28 THEN 'HORARIO_CREAR'
                 WHEN 29 THEN 'HORARIO_EDITAR'
                 WHEN 30 THEN 'HORARIO_ELIMINAR'
                 WHEN 31 THEN 'HORARIO_CAMBIAR_ESTADO'
    END
WHERE id_permiso BETWEEN 1 AND 31;

SELECT * FROM permiso;

SELECT
    a.id_autorizacion,
    r.nombre,
    p.modulo,
    p.nombre,
    p.codigo
FROM autorizacion a
INNER JOIN rol r ON a.id_rol = r.id_rol
INNER JOIN permiso p ON a.id_permiso = p.id_permiso;

SELECT * FROM rol;

CREATE TABLE cargo
(
    id_cargo    INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(60)  NOT NULL,
    es_personal_medico BOOLEAN NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    estado      INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_cargo` PRIMARY KEY (id_cargo),
    CONSTRAINT `unq_cargo_nombre` UNIQUE (nombre)
) ENGINE = InnoDB;

SELECT * FROM cargo;

-- ---------------------------------------------------------------------
-- Núcleo: persona y quienes la especializan (paciente, empleado, doctor)
-- ---------------------------------------------------------------------

CREATE TABLE persona
(
    id_persona        INT          NOT NULL AUTO_INCREMENT,
    id_tipo_documento INT          NOT NULL,
    numero_documento  VARCHAR(15)  NOT NULL,
    nombre            VARCHAR(60)  NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    fec_nacimiento    DATE         NOT NULL,
    genero            VARCHAR(30)  NOT NULL,
    telefono          VARCHAR(20)  NOT NULL,
    direccion         VARCHAR(150) NOT NULL,
    correo            VARCHAR(100) NOT NULL,
    nacionalidad      VARCHAR(50)  NOT NULL,
    fec_creacion      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME     NULL,
    estado            INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_persona` PRIMARY KEY (id_persona),
    CONSTRAINT `fk_persona-tipo_documento` FOREIGN KEY (id_tipo_documento)
        REFERENCES tipo_documento (id_tipo_documento),
    CONSTRAINT `unq_persona_documento` UNIQUE (id_tipo_documento, numero_documento)
) ENGINE = InnoDB;

CREATE TABLE paciente
(
    id_paciente       INT         NOT NULL AUTO_INCREMENT,
    id_persona        INT         NOT NULL,
    codigo_asegurado  VARCHAR(20) NOT NULL,
    entidad_asegurado VARCHAR(60) NOT NULL,
    estado            INT         NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_paciente` PRIMARY KEY (id_paciente),
    CONSTRAINT `fk_paciente-persona` FOREIGN KEY (id_persona)
        REFERENCES persona (id_persona),
    CONSTRAINT `unq_paciente_persona` UNIQUE (id_persona)
) ENGINE = InnoDB;

CREATE TABLE empleado
(
    id_empleado INT          NOT NULL AUTO_INCREMENT,
    id_persona  INT          NOT NULL,
    id_cargo    INT          NOT NULL,
    fec_ingreso DATE         NOT NULL,
    fec_retiro  DATE         NOT NULL,
    foto        VARCHAR(255) NOT NULL,
    estado      INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_empleado` PRIMARY KEY (id_empleado),
    CONSTRAINT `fk_empleado-persona` FOREIGN KEY (id_persona)
        REFERENCES persona (id_persona),
    CONSTRAINT `fk_empleado-cargo` FOREIGN KEY (id_cargo)
        REFERENCES cargo (id_cargo),
    CONSTRAINT `unq_empleado_persona` UNIQUE (id_persona)
) ENGINE = InnoDB;

CREATE TABLE medico
(
    id_medico           INT         NOT NULL AUTO_INCREMENT,
    id_empleado         INT         NOT NULL,
    id_especialidad     INT         NOT NULL,
    numero_colegiatura  VARCHAR(20) NOT NULL,
    numero_especialidad VARCHAR(20) NOT NULL,
    consejo_regional    VARCHAR(60) NOT NULL,
    estado              INT         NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',

    CONSTRAINT `pk_medico` PRIMARY KEY (id_medico),

    CONSTRAINT `fk_medico-empleado`
        FOREIGN KEY (id_empleado)
            REFERENCES empleado (id_empleado),

    CONSTRAINT `fk_medico-especialidad`
        FOREIGN KEY (id_especialidad)
            REFERENCES especialidad (id_especialidad),

    CONSTRAINT `unq_medico_empleado`
        UNIQUE (id_empleado),

    CONSTRAINT `unq_medico_colegiatura`
        UNIQUE (numero_colegiatura)

) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- Seguridad: usuario, roles y permisos
-- ---------------------------------------------------------------------

CREATE TABLE usuario
(
    id_usuario        INT          NOT NULL AUTO_INCREMENT,
    id_persona        INT          NOT NULL,
    usuario           VARCHAR(30)  NOT NULL,
    clave             VARCHAR(255) NOT NULL,
    fec_creacion      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME     NOT NULL,
    requiere_cambio_clave      BOOLEAN      NOT NULL DEFAULT TRUE,
    estado            INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_usuario` PRIMARY KEY (id_usuario),
    CONSTRAINT `fk_usuario-persona` FOREIGN KEY (id_persona)
        REFERENCES persona (id_persona),
    CONSTRAINT `unq_usuario_login` UNIQUE (usuario)
) ENGINE = InnoDB;

-- 1. Crear la tabla intermedia para asignar múltiples roles
CREATE TABLE usuario_rol (
                             id_usuario_rol INT NOT NULL AUTO_INCREMENT,
                             id_usuario INT NOT NULL,
                             id_rol INT NOT NULL,
                             fec_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             fec_actualizacion DATETIME NOT NULL
                                                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             estado INT NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',

                             CONSTRAINT pk_usuario_rol
                                 PRIMARY KEY (id_usuario_rol),

                             CONSTRAINT fk_usuario_rol_usuario
                                 FOREIGN KEY (id_usuario)
                                     REFERENCES usuario (id_usuario),

                             CONSTRAINT fk_usuario_rol_rol
                                 FOREIGN KEY (id_rol)
                                     REFERENCES rol (id_rol),

                             CONSTRAINT unq_usuario_rol
                                 UNIQUE (id_usuario, id_rol)
) ENGINE = InnoDB;

SELECT * FROM usuario;

SELECT * FROM usuario_rol;

INSERT INTO usuario_rol (
    id_usuario,
    id_rol,
    estado
) VALUES (
             3,
             2,
             1
         );



SELECT * FROM rol;

CREATE TABLE autorizacion
(
    id_autorizacion INT NOT NULL AUTO_INCREMENT,
    id_rol          INT NOT NULL,
    id_permiso      INT NOT NULL,
    estado          INT NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_autorizacion` PRIMARY KEY (id_autorizacion),
    CONSTRAINT `fk_autorizacion-rol` FOREIGN KEY (id_rol)
        REFERENCES rol (id_rol),
    CONSTRAINT `fk_autorizacion-permiso` FOREIGN KEY (id_permiso)
        REFERENCES permiso (id_permiso),
    CONSTRAINT `unq_autorizacion_rol_permiso` UNIQUE (id_rol, id_permiso)
) ENGINE = InnoDB;

INSERT INTO autorizacion (id_rol, id_permiso)
SELECT 1, p.id_permiso
FROM permiso p
WHERE p.id_permiso BETWEEN 2 AND 31
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 1
      AND a.id_permiso = p.id_permiso
);

INSERT INTO autorizacion (id_rol, id_permiso)
SELECT 1, p.id_permiso
FROM permiso p
WHERE p.id_permiso BETWEEN 32 AND 36
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 1
      AND a.id_permiso = p.id_permiso
);

INSERT INTO autorizacion (id_rol, id_permiso)
SELECT 1, p.id_permiso
FROM permiso p
WHERE p.id_permiso BETWEEN 37 AND 38
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 1
      AND a.id_permiso = p.id_permiso
);


INSERT INTO autorizacion (id_rol, id_permiso)
SELECT 1, p.id_permiso
FROM permiso p
WHERE p.id_permiso BETWEEN 39 AND 41
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 1
      AND a.id_permiso = p.id_permiso
);

SELECT * FROM autorizacion a
    INNER JOIN rol r ON a.id_rol = r.id_rol
WHERE r.id_rol=1;

INSERT INTO autorizacion (id_rol, id_permiso)
SELECT 1, p.id_permiso
FROM permiso p
WHERE p.id_permiso BETWEEN 42 AND 98
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = 1
      AND a.id_permiso = p.id_permiso
);

SELECT * FROM paciente p WHERE p.id_persona=190;

SELECT e.id_persona FROM empleado e WHERE e.id_empleado=1;

SELECT * FROM autorizacion a
                  INNER JOIN rol r ON a.id_rol = r.id_rol
WHERE r.id_rol=1;


SELECT * FROM autorizacion;

CREATE TABLE token_acceso
(
    id_token_acceso INT          NOT NULL AUTO_INCREMENT,
    usuario_id      INT          NOT NULL,
    token           TEXT         NOT NULL,
    expired         BOOLEAN      NOT NULL,
    revoked         BOOLEAN      NOT NULL DEFAULT FALSE,
    token_type      ENUM('BEARER'),
    CONSTRAINT `pk_token_acceso` PRIMARY KEY (id_token_acceso),
    CONSTRAINT `fk_token_acceso-usuario` FOREIGN KEY (usuario_id)
        REFERENCES usuario (id_usuario),
    CONSTRAINT `unq_token_acceso_token` UNIQUE (token)
) ENGINE = InnoDB;

CREATE TABLE horario_atencion
(
    id_horario_atencion INT  NOT NULL AUTO_INCREMENT,
    id_empleado         INT  NOT NULL,
    dia_semana          INT  NOT NULL COMMENT '1=lunes...7=domingo (ISO-8601)',
    hora_entrada        TIME NOT NULL,
    hora_salida         TIME NOT NULL,
    fec_inicio          DATE NOT NULL,
    fec_fin             DATE NOT NULL,
    estado              INT  NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_horario_atencion` PRIMARY KEY (id_horario_atencion),
    CONSTRAINT `fk_horario_atencion-empleado` FOREIGN KEY (id_empleado)
        REFERENCES empleado (id_empleado),
    CONSTRAINT `chk_horario_atencion_dia` CHECK (dia_semana BETWEEN 1 AND 7)
) ENGINE = InnoDB;

SELECT * FROM rol;

SELECT * FROM usuario;

SELECT * FROM especialidad;

SELECT
    e.id_empleado,
    CONCAT(p.nombre,' ',p.apellido) AS nombres
FROM empleado e
    INNER JOIN persona p
        ON e.id_persona = p.id_persona
    INNER JOIN paciente pa on p.id_persona = pa.id_persona
WHERE pa.id_persona=p.id_persona
  AND pa.estado=1 -- activo=1
  AND p.numero_documento='60415749';

SELECT  * FROM usuario;



SELECT
    e.id_empleado,
    p.id_persona,
    CONCAT(p.nombre, ' ', p.apellido) AS nombres,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM paciente pa
            WHERE pa.id_persona = p.id_persona
              AND pa.estado = 1
        ) THEN 'ACTIVO'

        WHEN EXISTS (
            SELECT 1
            FROM paciente pa
            WHERE pa.id_persona = p.id_persona
              AND pa.estado = 2
        ) THEN 'DESACTIVADO'

        WHEN EXISTS (
            SELECT 1
            FROM paciente pa
            WHERE pa.id_persona = p.id_persona
              AND pa.estado = 0
        ) THEN 'REACTIVAR'

        ELSE 'REGISTRAR'
        END AS accion
FROM empleado e
         INNER JOIN persona p
                    ON e.id_persona = p.id_persona
WHERE p.numero_documento = :numeroDocumento
  AND e.estado = 1
  AND p.estado = 1;

SELECT
    CONCAT(p.nombre,' ',p.apellido),
    p.numero_documento,
    e.id_empleado
FROM empleado e INNER JOIN persona p
ON e.id_persona = p.id_persona
WHERE e.estado=1;

SELECT * FROM empleado;

SELECT * FROM paciente;

SELECT
    CONCAT(pe.nombre,' ', pe.apellido) AS nombre,
    pe.numero_documento
from paciente pa
INNER JOIN persona pe
    ON pa.id_persona = pe.id_persona;


INSERT INTO permiso (nombre, descripcion, estado)
SELECT 'USUARIOS_GESTIONAR', 'Gestionar usuarios: cambiar rol y estado', 1
FROM (SELECT 1 AS uno) AS t
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'USUARIOS_GESTIONAR'
);

INSERT INTO autorizacion (id_rol, id_permiso, estado)
SELECT r.id_rol, p.id_permiso, 1
FROM rol r
         JOIN permiso p ON p.nombre = 'USUARIOS_GESTIONAR'
WHERE UPPER(r.nombre) = 'ADMINISTRADOR'
  AND NOT EXISTS (
    SELECT 1
    FROM autorizacion a
    WHERE a.id_rol = r.id_rol
      AND a.id_permiso = p.id_permiso
);

SELECT * FROM medico;

-- ---------------------------------------------------------------------
-- Atención médica: cita, diagnóstico y sus derivados
-- ---------------------------------------------------------------------

CREATE TABLE cita_medica
(
    id_cita_medica INT          NOT NULL AUTO_INCREMENT,
    id_paciente    INT          NOT NULL,
    id_medico      INT          NOT NULL,
    id_usuario     INT          NOT NULL,
    fec_cita       DATE         NOT NULL,
    hora_inicio    TIME         NOT NULL,
    hora_salida    TIME         NOT NULL,
    motivo         VARCHAR(200) NOT NULL,
    estado         INT          NOT NULL DEFAULT 1
        COMMENT '1=programada, 2=atendida, 3=cancelada, 4=reprogramada',

    CONSTRAINT `pk_cita_medica`
        PRIMARY KEY (id_cita_medica),

    CONSTRAINT `fk_cita_medica-paciente`
        FOREIGN KEY (id_paciente)
            REFERENCES paciente (id_paciente),

    CONSTRAINT `fk_cita_medica-medico`
        FOREIGN KEY (id_medico)
            REFERENCES medico (id_medico),

    CONSTRAINT `fk_cita_medica-usuario`
        FOREIGN KEY (id_usuario)
            REFERENCES usuario (id_usuario)

) ENGINE = InnoDB;

CREATE INDEX idx_cita_medica_fecha
    ON cita_medica (fec_cita);

CREATE TABLE diagnostico
(
    id_diagnostico   INT          NOT NULL AUTO_INCREMENT,
    id_cita_medica   INT          NOT NULL,
    codigo           VARCHAR(15)  NOT NULL,
    descripcion      VARCHAR(300) NOT NULL,
    tipo_diagnostico INT          NOT NULL COMMENT '1=presuntivo, 2=definitivo',
    observaciones    VARCHAR(300) NOT NULL,
    fec_diagnostico  DATE         NOT NULL,
    estado           INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_diagnostico` PRIMARY KEY (id_diagnostico),
    CONSTRAINT `fk_diagnostico-cita_medica` FOREIGN KEY (id_cita_medica)
        REFERENCES cita_medica (id_cita_medica),
    CONSTRAINT `chk_diagnostico_tipo` CHECK (tipo_diagnostico IN (1, 2))
) ENGINE = InnoDB;

CREATE INDEX idx_diagnostico_fecha ON diagnostico (fec_diagnostico);

CREATE TABLE tratamiento
(
    id_tratamiento     INT          NOT NULL AUTO_INCREMENT,
    id_diagnostico     INT          NOT NULL,
    nombre_medicamento VARCHAR(100) NOT NULL,
    dosis              VARCHAR(40)  NOT NULL,
    via_administracion VARCHAR(30)  NOT NULL,
    frecuencia         VARCHAR(40)  NOT NULL,
    duracion_dias      INT          NOT NULL,
    tot_cantidad       INT          NOT NULL,
    desc_indicacion    VARCHAR(300) NOT NULL,
    estado             INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_tratamiento` PRIMARY KEY (id_tratamiento),
    CONSTRAINT `fk_tratamiento-diagnostico` FOREIGN KEY (id_diagnostico)
        REFERENCES diagnostico (id_diagnostico)
) ENGINE = InnoDB;

CREATE TABLE indicacion
(
    id_indicacion   INT          NOT NULL AUTO_INCREMENT,
    id_diagnostico  INT          NOT NULL,
    tipo_indicacion VARCHAR(30)  NOT NULL,
    descripcion     VARCHAR(300) NOT NULL,
    dias_reposo     INT          NOT NULL,
    frecuencia      VARCHAR(40)  NOT NULL,
    estado          INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_indicacion` PRIMARY KEY (id_indicacion),
    CONSTRAINT `fk_indicacion-diagnostico` FOREIGN KEY (id_diagnostico)
        REFERENCES diagnostico (id_diagnostico)
) ENGINE = InnoDB;

CREATE TABLE derivacion
(
    id_derivacion   INT          NOT NULL AUTO_INCREMENT,
    id_diagnostico  INT          NOT NULL,
    id_especialidad INT          NOT NULL,
    motivo          VARCHAR(200) NOT NULL,
    urgencia        INT          NOT NULL DEFAULT 1 COMMENT '1=normal, 2=urgente',
    estado          INT          NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    CONSTRAINT `pk_derivacion` PRIMARY KEY (id_derivacion),
    CONSTRAINT `fk_derivacion-diagnostico` FOREIGN KEY (id_diagnostico)
        REFERENCES diagnostico (id_diagnostico),
    CONSTRAINT `fk_derivacion-especialidad` FOREIGN KEY (id_especialidad)
        REFERENCES especialidad (id_especialidad),
    CONSTRAINT `chk_derivacion_urgencia` CHECK (urgencia IN (1, 2))
) ENGINE = InnoDB;

CREATE TABLE examen_solicitado
(
    id_examen_solicitado INT          NOT NULL AUTO_INCREMENT,
    id_diagnostico       INT          NOT NULL,
    motivo               VARCHAR(200) NOT NULL,
    estado               INT          NOT NULL DEFAULT 1
        COMMENT '1=pendiente, 2=realizado, 3=cancelado',
    CONSTRAINT `pk_examen_solicitado` PRIMARY KEY (id_examen_solicitado),
    CONSTRAINT `fk_examen_solicitado-diagnostico` FOREIGN KEY (id_diagnostico)
        REFERENCES diagnostico (id_diagnostico)
) ENGINE = InnoDB;

CREATE TABLE codigo_recuperacion (
                                     id_codigo        INT AUTO_INCREMENT PRIMARY KEY,
                                     id_usuario       INT          NOT NULL,
                                     codigo_hash      VARCHAR(255) NOT NULL,
                                     fec_expiracion   DATETIME     NOT NULL,
                                     intentos         INT          NOT NULL DEFAULT 0,
                                     usado            TINYINT(1)   NOT NULL DEFAULT 0,
                                     fec_creacion     DATETIME     NOT NULL,
                                     CONSTRAINT fk_codigo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

INSERT INTO tipo_documento (codigo, descripcion, estado, longitud)
VALUES
    ('DNI', 'Documento Nacional de Identidad', 1,8),
    ('CE', 'Carné de Extranjería', 1, 9),
    ('PAS', 'Pasaporte', 1, 9),
    ('RUC', 'Registro Único de Contribuyentes', 0, 11);

SELECT * FROM usuario;

SELECT * FROM tipo_documento;
SELECT * FROM rol;
SELECT * FROM persona;

INSERT INTO rol (nombre, descripcion, estado)
VALUES
    ('ADMINISTRADOR', 'Acceso completo a la gestión del sistema', 1),
    ('MEDICO', 'Acceso a las funcionalidades relacionadas con la atención médica', 1),
    ('RECEPCIONISTA', 'Gestión de pacientes, citas y atención administrativa', 1);