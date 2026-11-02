package com.salud.consultorio.impl;

import com.salud.consultorio.model.enums.RutasImagen;
import com.salud.consultorio.service.IArchivoServicio;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ArchivoLocalServicio implements IArchivoServicio {

    private final static String CARPETA_BASE = "uploads";

    private final Path directorioBase = Paths.get(CARPETA_BASE);

    @Override
    public String guardar(MultipartFile archivo, RutasImagen ruta) {

        try {

            Path directorio = directorioBase.resolve(ruta.name().toUpperCase());

            Files.createDirectories(directorio);

            String extension = obtenerExtension(
                    archivo.getOriginalFilename()
            );

            String nombreArchivo = UUID.randomUUID()+extension;

            Path rutaUrl = directorio.resolve(nombreArchivo);

            archivo.transferTo(rutaUrl);

            return "/"+CARPETA_BASE+"/"+ruta+"/"+nombreArchivo;

        }catch (IOException e){
            throw new RuntimeException("Error al guardar archivo",e);
        }

    }

    @Override
    public void eliminar(String ruta) {
        if (ruta==null || ruta.isBlank()){
            return;
        }

        if (!ruta.startsWith("/uploads/") && !ruta.startsWith("uploads/")) {
            return;
        }

        try {
            String rutaArchivo = ruta.startsWith("/")
                    ? ruta.substring(1)
                    : ruta;

            Path archivo = Paths.get(rutaArchivo);

            Files.deleteIfExists(archivo);

        }catch (IOException e){
            throw new RuntimeException("Error al eliminar archivo: ",e);
        }
    }

    private String obtenerExtension(String nombre){

        if (nombre == null || !nombre.contains(".")){
            return "";
        }

        return nombre.substring(
                nombre.lastIndexOf(".")
        );

    }

}