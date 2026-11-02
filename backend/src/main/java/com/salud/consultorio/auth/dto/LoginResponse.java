package com.salud.consultorio.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginResponse(
        TokenResponse sesion,
        @JsonProperty("requiere_seleccion_rol") boolean requiereSeleccionRol,
        @JsonProperty("token_seleccion") String tokenSeleccion,
        List<PerfilDTO> perfiles
) {

    public static LoginResponse conSesion(TokenResponse sesion) {
        return new LoginResponse(sesion, false, null, null);
    }

    public static LoginResponse conSeleccion(String tokenSeleccion, List<PerfilDTO> perfiles) {
        return new LoginResponse(null, true, tokenSeleccion, perfiles);
    }

}