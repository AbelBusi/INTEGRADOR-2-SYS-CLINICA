package com.salud.consultorio;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication
public class ConsultorioApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConsultorioApplication.class, args);
	}

	@Bean
	public CommandLineRunner verificarConexion(DataSource dataSource) {
		return args -> {
			System.out.println("--VERIFICANDO CCONEXION A LA BASE DE DATOS--");
			try (Connection connection = dataSource.getConnection()) {

				System.out.println("CONEXION A LA BASE DE DATOS EXITOSA");
			} catch (SQLException e) {
				System.out.println("ERROR: FALLO AL CONECTAR A LA BASE DE DATOS: " + e.getMessage());
			}
			System.out.println("--VERIFICACION FINALIZADA--");
		};
	}

}