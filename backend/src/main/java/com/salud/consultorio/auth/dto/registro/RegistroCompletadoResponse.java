package com.salud.consultorio.auth.dto.registro;

public record RegistroCompletadoResponse(boolean cuentaNueva, String mensaje, String correoEnmascarado) {}