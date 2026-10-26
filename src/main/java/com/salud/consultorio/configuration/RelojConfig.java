package com.salud.consultorio.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class RelojConfig {

    @Bean
    @ConditionalOnMissingBean(Clock.class)
    public Clock reloj(@Value("${app.zona-horaria:}") String zona) {
        ZoneId zoneId = (zona == null || zona.isBlank()) ? ZoneId.systemDefault() : ZoneId.of(zona.trim());
        return Clock.system(zoneId);
    }

}