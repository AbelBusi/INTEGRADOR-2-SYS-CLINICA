package com.salud.consultorio.configuration;

import com.salud.consultorio.model.enums.EntidadEstado;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class StringToEnumConverter implements Converter<String, EntidadEstado> {


    @Nullable
    @Override
    public EntidadEstado convert(String source) {
        return EntidadEstado.valueOf(source.toUpperCase());
    }
}
