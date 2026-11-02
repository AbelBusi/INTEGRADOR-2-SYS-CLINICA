package com.salud.consultorio.auth.impl;

import com.salud.consultorio.auth.service.IJwtServicio;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtServicioImpl implements IJwtServicio {

    private static final long EXPIRACION_SELECCION_MS = 5 * 60 * 1000L;

    @Value("${aplication.security.jwt.secret}")
    private String secretKey;

    @Value("${aplication.security.jwt.expiration}")
    private Integer jwtExpiration;

    @Value("${aplication.security.jwt.refresh.expiration}")
    private Integer refreshExpiration;


    @Override
    public String extraerUsuario(final String token) {
        return leerClaims(token).getSubject();
    }

    @Override
    public String generarToken(Usuario usuario, Rol rol) {
        return construirToken(usuario, rol, jwtExpiration, TIPO_ACCESO);
    }

    @Override
    public String generarTokenRefrescado(Usuario usuario, Rol rol) {
        return construirToken(usuario, rol, refreshExpiration, TIPO_REFRESH);
    }

    @Override
    public String generarTokenSeleccion(Usuario usuario) {

        long ahora = System.currentTimeMillis();

        return Jwts.builder()
                .id(usuario.getId().toString())
                .claims(Map.of("tipo", TIPO_SELECCION))
                .subject(usuario.getUsuario())
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + EXPIRACION_SELECCION_MS))
                .signWith(getSignInKey())
                .compact();
    }

    private String construirToken(Usuario usuario, Rol rol, long expiracion, String tipo) {

        List<String> permisos = rol.getRolPermisos().stream()
                .map(rp -> rp.getPermiso().getCodigo())
                .distinct()
                .toList();

        Map<String, Object> extraClaims = Map.of(
                "name", usuario.getUsuario(),
                "tipo", tipo,
                "authorities", permisos,
                "role", rol.getNombre(),
                "idRol", rol.getId()
        );

        long ahora = System.currentTimeMillis();

        return Jwts.builder()
                .id(usuario.getId().toString())
                .claims(extraClaims)
                .subject(usuario.getUsuario())
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + expiracion))
                .signWith(getSignInKey())
                .compact();
    }

    @Override
    public String extraerTipo(String token) {
        return leerClaims(token).get("tipo", String.class);
    }

    @Override
    public Integer extraerIdRol(String token) {
        return leerClaims(token).get("idRol", Integer.class);
    }

    @Override
    public boolean tokenValido(String token, UserDetails userDetails) {
        final String usuarioToken = extraerUsuario(token);
        return (usuarioToken.equals(userDetails.getUsername()) && !tokenExpirado(token));
    }

    @Override
    public boolean tokenExpirado(String token) {
        return leerClaims(token).getExpiration().before(new Date());
    }

    @Override
    public List<String> extraerPermisos(final String token) {
        return leerClaims(token).get("authorities", List.class);
    }

    private Claims leerClaims(final String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}