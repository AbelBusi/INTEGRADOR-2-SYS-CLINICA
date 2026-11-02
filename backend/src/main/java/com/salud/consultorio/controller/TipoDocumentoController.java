package com.salud.consultorio.controller;

import com.salud.consultorio.dto.tipoDocumento.TipoDocumentoResumenDTO;
import com.salud.consultorio.model.payload.MensajeResponse;
import com.salud.consultorio.service.ITipoDocumentoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/tipo-documentos")
@RequiredArgsConstructor
public class TipoDocumentoController {

    private final ITipoDocumentoServicio tipoDocumentoServicio;

    @GetMapping("resumen")
    public ResponseEntity<MensajeResponse> listaResumen(){

        List<TipoDocumentoResumenDTO> lista = tipoDocumentoServicio.listaResumen();

        return new ResponseEntity<>(MensajeResponse.builder()
                .mensaje("Lista de Tipo de documentos")
                .object(lista).build(), HttpStatus.OK);

    }

}