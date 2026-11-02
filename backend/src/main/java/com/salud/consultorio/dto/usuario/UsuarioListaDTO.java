package com.salud.consultorio.dto.usuario;

public class UsuarioListaDTO {

    private Integer id;
    private String nombre;
    private String correo;
    private String usuario;
    private String nombreRol;
    private Integer estado;
    private String tipo;

    public UsuarioListaDTO(Integer id, String nombre, String correo, String usuario, String nombreRol, Integer estado, String tipo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.usuario = usuario;
        this.nombreRol = nombreRol;
        this.estado = estado;
        this.tipo = tipo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
