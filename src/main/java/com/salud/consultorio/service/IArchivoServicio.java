package com.salud.consultorio.service;

import com.salud.consultorio.model.enums.RutasImagen;
import org.springframework.web.multipart.MultipartFile;

public interface IArchivoServicio {

    String guardar (MultipartFile archivo, RutasImagen ruta);

    void eliminar(String ruta);
}