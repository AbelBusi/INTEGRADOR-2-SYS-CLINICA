package com.salud.consultorio.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RecursosWebConfig implements WebMvcConfigurer {

    private final static String CARPETA_BASE = "uploads";
    private final static String RUTA_CARPETA= "file:uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/"+CARPETA_BASE+"/**")
                .addResourceLocations(RUTA_CARPETA);
    }
}