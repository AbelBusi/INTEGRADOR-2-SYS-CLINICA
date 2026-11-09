package com.salud.consultorio.dto.citaMedica;

import java.util.List;

public record CitaMedicaPaginaDTO(
        List<CitaMedicaRespuestaDTO> contenido,
        int pagina,
        int tamanio,
        long totalElementos,
        int totalPaginas
) {
}