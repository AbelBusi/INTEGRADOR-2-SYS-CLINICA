package com.salud.consultorio.auth.configuration;

import com.salud.consultorio.model.entity.UsuarioRol;
import com.salud.consultorio.repository.IUsuarioRolRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final IUsuarioRolRepositorio usuarioRolRepositorio;

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> {

            // Solo asignaciones vigentes: asignación activa (1) y rol activo (1).
            // Antes se leían todas, y un rol revocado o desactivado seguía aportando permisos.
            List<UsuarioRol> asignaciones = usuarioRolRepositorio
                    .findAllByUsuario_UsuarioAndEstadoAndRol_Estado(username, 1, 1);

            if (asignaciones.isEmpty()){
                throw new UsernameNotFoundException("El usuario no existe o no tiene roles activos");
            }

            var usuario = asignaciones.get(0).getUsuario();

            List<SimpleGrantedAuthority> permisos = asignaciones.stream()
                    .flatMap(usuarioRol -> usuarioRol.getRol()
                            .getRolPermisos()
                            .stream())
                    .map(rolPermiso -> new SimpleGrantedAuthority(
                            rolPermiso.getPermiso().getCodigo()
                    ))
                    .distinct()
                    .toList();

            return User.builder()
                    .username(usuario.getUsuario())
                    .password(usuario.getClaveAcceso())
                    .authorities(permisos)
                    .build();

        };

    }

    @Bean
    public AuthenticationProvider authenticationProvider(){

        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userDetailsService());
        auth.setPasswordEncoder(passwordEncoder());

        return auth;

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)throws Exception{
        return config.getAuthenticationManager();
    }

}