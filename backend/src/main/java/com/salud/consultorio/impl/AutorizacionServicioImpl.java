package com.salud.consultorio.impl;

import com.salud.consultorio.auth.service.ITokenServicio;
import com.salud.consultorio.dto.autorizacion.*;
import com.salud.consultorio.model.entity.Permiso;
import com.salud.consultorio.model.entity.Rol;
import com.salud.consultorio.model.entity.RolPermiso;
import com.salud.consultorio.repository.IAutorizacionRepositorio;
import com.salud.consultorio.service.IAutorizacionServicio;
import com.salud.consultorio.service.IPermisoServicio;
import com.salud.consultorio.service.IRolServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutorizacionServicioImpl implements IAutorizacionServicio {

    private final IAutorizacionRepositorio autorizacionRepositorio;
    private final IRolServicio rolServicio;
    private final IPermisoServicio permisoServicio;
    private final ITokenServicio tokenServicio;

    @Transactional
    @Override
    public AutorizacionRespuesta crear(AutorizacionCrear dto) {

        if (dto.permisos() == null || dto.permisos().isEmpty()) {
            throw new IllegalArgumentException("Debes proporcionar almenos un permiso");
        }

        Set<Integer> idPermisos = dto.permisos().stream()
                .map(id -> id.idPermiso())
                .collect(Collectors.toSet());

        if (dto.permisos().size() != idPermisos.size()) {
            throw new IllegalArgumentException("Existen ID duplicados");
        }

        Rol rol = rolServicio.entidadPorIDTransaccion(dto.idRol());

        List<Permiso> permisos = permisoServicio.traerPermisosExistentesPorID(idPermisos.stream().toList());

        List<Integer> idAutorizacionDuplicado = idPermisos.stream()
                .filter(p -> autorizacionRepositorio.existsByRol_IdAndPermiso_Id(rol.getId(), p)).toList();

        if (!idAutorizacionDuplicado.isEmpty()) {
            throw new IllegalArgumentException("No se permiten autorizaciones duplicadas: " + idAutorizacionDuplicado);
        }

        List<RolPermiso> listAutorizaciones = permisos.stream()
                .map(p -> RolPermiso.builder()
                        .rol(rol)
                        .permiso(p)
                        .build()
                ).toList();

        autorizacionRepositorio.saveAll(listAutorizaciones);

        return new AutorizacionRespuesta(rol.getId(), dto.permisos());

    }

    @Transactional(readOnly = true)
    @Override
    public AutorizacionRolLeer listarPermisosPorRol(Integer idRol) {

        List<PermisosProyeccion> lista = autorizacionRepositorio.listarPermisosPorRol(idRol);

        List<PermisosRolLeer> modulos = lista.stream()
                .collect(Collectors.groupingBy(
                        PermisosProyeccion::modulo,
                        LinkedHashMap::new,
                        Collectors.mapping(
                                p -> new PermisosLeer(
                                        p.id(),
                                        p.nombre(),
                                        p.codigo()
                                ),
                                Collectors.toList()
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> new PermisosRolLeer(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();

        String nombreRol = rolServicio.entidadPorIDTransaccion(idRol).getNombre();

        return new AutorizacionRolLeer(nombreRol, modulos);
    }

    @Transactional(readOnly = true)
    @Override
    public PermisosModulosLeer listarPermisos() {

        List<PermisosProyeccion> lista =
                autorizacionRepositorio.listarPermisos();

        List<PermisosRolLeer> modulos = lista.stream()
                .collect(Collectors.groupingBy(
                        PermisosProyeccion::modulo,
                        LinkedHashMap::new,
                        Collectors.mapping(
                                p -> new PermisosLeer(
                                        p.id(),
                                        p.nombre(),
                                        p.codigo()
                                ),
                                Collectors.toList()
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> new PermisosRolLeer(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();

        return new PermisosModulosLeer(modulos);
    }


    @Transactional
    @Override
    public AutorizacionRespuesta sincronizar(AutorizacionSincronizar dto) {

        if (dto.idPermisos() == null) {
            throw new IllegalArgumentException(
                    "Debes proporcionar la lista de permisos seleccionados"
            );
        }

        Set<Integer> idPermisos = new LinkedHashSet<>(dto.idPermisos());

        if (dto.idPermisos().size() != idPermisos.size()) {
            throw new IllegalArgumentException(
                    "Existen IDs de permisos duplicados"
            );
        }

        Rol rol = rolServicio.entidadPorIDTransaccion(dto.idRol());

        List<Permiso> permisos = idPermisos.isEmpty()
                ? List.of()
                : permisoServicio.traerPermisosExistentesPorID(List.copyOf(idPermisos));

        Set<Integer> idActuales = new HashSet<>(
                autorizacionRepositorio.idsPermisoPorRol(rol.getId())
        );

        List<Integer> idEliminar = idActuales.stream()
                .filter(id -> !idPermisos.contains(id))
                .toList();

        if (!idEliminar.isEmpty()) {
            autorizacionRepositorio.eliminarPorRolYPermisos(rol.getId(), idEliminar);
        }

        List<RolPermiso> agregar = permisos.stream()
                .filter(p -> !idActuales.contains(p.getId()))
                .map(p -> RolPermiso.builder()
                        .rol(rol)
                        .permiso(p)
                        .build())
                .toList();

        autorizacionRepositorio.saveAll(agregar);

        tokenServicio.revocarPorRol(rol.getId());

        return new AutorizacionRespuesta(
                rol.getId(),
                idPermisos.stream()
                        .map(AgregarPermiso::new)
                        .toList()
        );
    }

}