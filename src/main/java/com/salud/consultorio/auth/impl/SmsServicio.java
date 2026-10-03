package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.exception.SmsEnvioException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

/**
 * Envío de SMS usando la API HTTP de TextBee (tu celular como gateway).
 * Requiere Spring Boot 3.2+ (RestClient).
 */
@Slf4j
@Service
public class SmsServicio {

    private final RestClient client;
    private final String deviceId;
    private final String codigoPais;

    public SmsServicio(
            @Value("${textbee.base-url}") String baseUrl,
            @Value("${textbee.api-key}") String apiKey,
            @Value("${textbee.device-id}") String deviceId,
            @Value("${textbee.default-country-code:51}") String codigoPais) {

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(10_000);

        this.client = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.deviceId = deviceId;
        this.codigoPais = codigoPais;
    }

    public void enviarCodigoRecuperacion(String telefono, String codigo, int minutos) {
        // Sin tildes para que el SMS use codificación GSM-7 (160 caracteres) y no UCS-2 (70)
        String mensaje = "Consultorio: su codigo de recuperacion es " + codigo
                + ". Vence en " + minutos + " minutos. No lo comparta.";

        Map<String, Object> body = Map.of(
                "deviceId", deviceId,
                "recipients", List.of(aE164(telefono)),
                "message", mensaje
        );

        try {
            client.post()
                    .uri("/gateway/send-sms")
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            throw new SmsEnvioException("No se pudo enviar el SMS de recuperación", e);
        }
    }

    /** "987 654 321" -> "+51987654321" ; "51987654321" -> "+51987654321" */
    private String aE164(String telefono) {
        String digitos = telefono.replaceAll("\\D", "");
        if (digitos.length() == 9) {
            return "+" + codigoPais + digitos;
        }
        return "+" + digitos;
    }
}