package com.salud.consultorio.auth.service;

import com.salud.consultorio.auth.dto.registro.*;

public interface IAutorregistroPacienteServicio {

    ElegibilidadResponse consultarElegibilidad(ElegibilidadRegistroRequest dto);

    ElegibilidadResponse verificarIdentidad(VerificarIdentidadRequest dto);

    CodigoEnviadoResponse enviarCodigo(EnviarCodigoRegistroRequest dto);

    RegistroCompletadoResponse completar(CompletarRegistroRequest dto);
}