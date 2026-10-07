package com.salud.consultorio.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EstadoCuentaResponse(

        @JsonProperty("requiere_cambio_clave")
        boolean requiereCambioClave

) { }