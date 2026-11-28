package com.salud.consultorio.impl;

import com.salud.consultorio.dto.medicamento.*;
import com.salud.consultorio.model.entity.Medicamento;
import com.salud.consultorio.model.enums.EntidadEstado;
import com.salud.consultorio.model.enums.RutasImagen;
import com.salud.consultorio.repository.IMedicamentoRepositorio;
import com.salud.consultorio.service.IArchivoServicio;
import com.salud.consultorio.service.IMedicamentoServicio;
import com.salud.consultorio.util.NormalizadorTexto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MedicamentoServicioImpl implements IMedicamentoServicio {

    private static final int ESTADO_ELIMINADO = 0;
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_INACTIVO = 2;
    private static final RutasImagen RUTAS_IMAGEN = RutasImagen.MEDICAMENTOS;

    private static final long TAMANIO_MAXIMO_IMAGEN = 2L * 1024 * 1024;
    private static final Set<String> TIPOS_IMAGEN = Set.of("image/jpeg", "image/png", "image/webp");

    /** Desde este parecido (0 a 1) dos nombres se consideran posible duplicado mal escrito. */
    private static final double UMBRAL_SIMILITUD = 0.75;
    private static final int MAXIMO_SIMILARES = 6;

    private static final int MINIMO_CARACTERES_BUSQUEDA = 3;
    private static final int MAXIMO_RESULTADOS_BUSQUEDA = 10;

    private final IMedicamentoRepositorio medicamentoRepositorio;
    private final IArchivoServicio archivoServicio;

    @Transactional(readOnly = true)
    @Override
    public List<MedicamentoRespuestaDTO> lista(EntidadEstado estado) {

        List<Medicamento> medicamentos;

        if (estado == EntidadEstado.ACTIVO) {
            medicamentos = medicamentoRepositorio.findByEstadoOrderByNombreAsc(ESTADO_ACTIVO);
        } else if (estado == EntidadEstado.INACTIVO) {
            medicamentos = medicamentoRepositorio.findByEstadoOrderByNombreAsc(ESTADO_INACTIVO);
        } else {
            medicamentos = medicamentoRepositorio.findByEstadoNotOrderByNombreAsc(ESTADO_ELIMINADO);
        }

        return medicamentos.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public MedicamentoRespuestaDTO entidadPorID(Integer id) {

        validarId(id);

        Medicamento medicamento = medicamentoRepositorio.findById(id)
                .filter(m -> m.getEstado() != ESTADO_ELIMINADO)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el medicamento con ID: " + id));

        return toDto(medicamento);
    }

    @Transactional
    @Override
    public MedicamentoRespuestaDTO crear(MedicamentoCrearDTO dto, MultipartFile imagen) {

        if (dto == null) {
            throw new IllegalArgumentException("Los datos del medicamento son obligatorios.");
        }

        String nombre = formatearNombre(dto.nombre());
        String concentracion = limpiar(dto.concentracion());
        String nombreNormalizado = NormalizadorTexto.normalizar(nombre);
        String concentracionNormalizada = NormalizadorTexto.compactar(concentracion);

        if (nombreNormalizado.isEmpty()) {
            throw new IllegalArgumentException("El nombre del medicamento no es válido.");
        }

        if (medicamentoRepositorio.existsByNombreNormalizadoAndConcentracionNormalizadaAndEstadoNot(
                nombreNormalizado, concentracionNormalizada, ESTADO_ELIMINADO)) {
            throw new IllegalArgumentException(mensajeDuplicado(nombre, concentracion));
        }

        validarImagen(imagen);

        Medicamento medicamento = Medicamento.builder()
                .nombre(nombre)
                .nombreNormalizado(nombreNormalizado)
                .principioActivo(limpiar(dto.principioActivo()))
                .concentracion(concentracion)
                .concentracionNormalizada(concentracionNormalizada)
                .grupoTerapeutico(dto.grupoTerapeutico())
                .indicacionTerapeutica(dto.indicacionTerapeutica())
                .laboratorio(limpiar(dto.laboratorio()))
                .descripcion(limpiar(dto.descripcion()))
                .requiereReceta(dto.requiereReceta())
                .estado(ESTADO_ACTIVO)
                .build();

        String imagenNueva = null;

        try {

            if (imagen != null && !imagen.isEmpty()) {
                imagenNueva = archivoServicio.guardar(imagen, RUTAS_IMAGEN);
                medicamento.setFoto(imagenNueva);
            }

            return toDto(medicamentoRepositorio.saveAndFlush(medicamento));

        } catch (RuntimeException e) {

            if (imagenNueva != null) {
                archivoServicio.eliminar(imagenNueva);
            }

            throw e;
        }
    }

    @Transactional
    @Override
    public MedicamentoRespuestaDTO actualizar(MedicamentoActualizarDTO dto, Integer id, MultipartFile imagen) {

        validarId(id);

        if (dto == null) {
            throw new IllegalArgumentException("Los datos del medicamento son obligatorios.");
        }

        Medicamento medicamento = medicamentoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medicamento que desea actualizar no existe.")
        );

        if (medicamento.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede actualizar un medicamento eliminado.");
        }

        String nombre = formatearNombre(dto.nombre());
        String concentracion = limpiar(dto.concentracion());
        String nombreNormalizado = NormalizadorTexto.normalizar(nombre);
        String concentracionNormalizada = NormalizadorTexto.compactar(concentracion);

        if (nombreNormalizado.isEmpty()) {
            throw new IllegalArgumentException("El nombre del medicamento no es válido.");
        }

        if (medicamentoRepositorio.existsByNombreNormalizadoAndConcentracionNormalizadaAndEstadoNotAndIdNot(
                nombreNormalizado, concentracionNormalizada, ESTADO_ELIMINADO, id)) {
            throw new IllegalArgumentException(mensajeDuplicado(nombre, concentracion));
        }

        validarImagen(imagen);

        medicamento.setNombre(nombre);
        medicamento.setNombreNormalizado(nombreNormalizado);
        medicamento.setPrincipioActivo(limpiar(dto.principioActivo()));
        medicamento.setConcentracion(concentracion);
        medicamento.setConcentracionNormalizada(concentracionNormalizada);
        medicamento.setLaboratorio(limpiar(dto.laboratorio()));
        medicamento.setDescripcion(limpiar(dto.descripcion()));
        medicamento.setGrupoTerapeutico(dto.grupoTerapeutico());
        medicamento.setIndicacionTerapeutica(dto.indicacionTerapeutica());
        medicamento.setRequiereReceta(dto.requiereReceta());

        String fotoAnterior = medicamento.getFoto();
        String imagenNueva = null;
        boolean reemplazaFoto = false;

        try {

            if (imagen != null && !imagen.isEmpty()) {
                imagenNueva = archivoServicio.guardar(imagen, RUTAS_IMAGEN);
                medicamento.setFoto(imagenNueva);
                reemplazaFoto = true;
            } else if (Boolean.TRUE.equals(dto.quitarImagen())) {
                medicamento.setFoto(null);
                reemplazaFoto = true;
            }

            medicamentoRepositorio.saveAndFlush(medicamento);

        } catch (RuntimeException e) {

            if (imagenNueva != null) {
                archivoServicio.eliminar(imagenNueva);
            }

            throw e;
        }

        // La imagen anterior se borra solo cuando los cambios ya se guardaron sin error.
        if (reemplazaFoto && fotoAnterior != null && !fotoAnterior.isBlank()) {
            archivoServicio.eliminar(fotoAnterior);
        }

        return toDto(medicamento);
    }

    @Transactional
    @Override
    public void cambiarEstado(Integer id, EntidadEstado estado) {

        validarId(id);

        if (estado == null) {
            throw new IllegalArgumentException("El estado es obligatorio.");
        }

        Medicamento medicamento = medicamentoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medicamento que desea cambiarle el estado no existe.")
        );

        if (medicamento.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("No se puede cambiar el estado de un medicamento eliminado.");
        }

        switch (estado) {

            case ACTIVO -> {
                if (medicamento.getEstado() == ESTADO_ACTIVO) {
                    throw new IllegalArgumentException("El medicamento ya se encuentra activo.");
                }
                medicamento.setEstado(ESTADO_ACTIVO);
            }

            case INACTIVO -> {
                if (medicamento.getEstado() == ESTADO_INACTIVO) {
                    throw new IllegalArgumentException("El medicamento ya se encuentra inactivo.");
                }
                medicamento.setEstado(ESTADO_INACTIVO);
            }

            default -> throw new IllegalArgumentException("Solo se permite cambiar a estado ACTIVO o INACTIVO.");
        }
    }

    @Transactional
    @Override
    public void eliminarPorId(Integer id) {

        validarId(id);

        Medicamento medicamento = medicamentoRepositorio.findById(id).orElseThrow(
                () -> new EntityNotFoundException("El medicamento que desea eliminar no existe.")
        );

        if (medicamento.getEstado() == ESTADO_ELIMINADO) {
            throw new IllegalArgumentException("El medicamento ya se encuentra eliminado.");
        }

        // Eliminación lógica: otros módulos pueden seguir refiriéndose a él.
        medicamento.setEstado(ESTADO_ELIMINADO);
    }

    @Transactional(readOnly = true)
    @Override
    public List<MedicamentoSimilarDTO> similares(String nombre, Integer idExcluir) {

        String buscado = NormalizadorTexto.normalizar(nombre);

        if (buscado.length() < 3) {
            return List.of();
        }

        return medicamentoRepositorio.findByEstadoNotOrderByNombreAsc(ESTADO_ELIMINADO).stream()
                .filter(m -> idExcluir == null || !m.getId().equals(idExcluir))
                .map(m -> new Candidato(m, puntaje(buscado, m)))
                .filter(c -> c.puntaje() >= UMBRAL_SIMILITUD)
                .sorted(Comparator.comparingDouble(Candidato::puntaje).reversed())
                .limit(MAXIMO_SIMILARES)
                .map(c -> new MedicamentoSimilarDTO(
                        c.medicamento().getId(),
                        c.medicamento().getNombre(),
                        c.medicamento().getConcentracion(),
                        c.medicamento().getGrupoTerapeutico(),
                        c.medicamento().getEstado()))
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<MedicamentoBusquedaDTO> buscar(String texto) {

        String buscado = NormalizadorTexto.normalizar(texto);

        if (buscado.length() < MINIMO_CARACTERES_BUSQUEDA) {
            return List.of();
        }

        return medicamentoRepositorio
                .buscarPorTexto(buscado, ESTADO_ACTIVO, PageRequest.of(0, MAXIMO_RESULTADOS_BUSQUEDA))
                .stream()
                .map(m -> new MedicamentoBusquedaDTO(
                        m.getId(),
                        m.getNombre(),
                        m.getConcentracion(),
                        m.getPrincipioActivo(),
                        m.getGrupoTerapeutico(),
                        m.getRequiereReceta(),
                        m.getFoto()))
                .toList();
    }

    /* ------------------------------ Apoyo ------------------------------ */

    private record Candidato(Medicamento medicamento, double puntaje) {
    }

    private double puntaje(String buscado, Medicamento medicamento) {

        double mejor = parecido(buscado, medicamento.getNombreNormalizado());

        String principio = NormalizadorTexto.normalizar(medicamento.getPrincipioActivo());

        if (!principio.isEmpty()) {
            mejor = Math.max(mejor, parecido(buscado, principio));
        }

        return mejor;
    }

    private double parecido(String a, String b) {

        if (b.isEmpty()) {
            return 0;
        }

        if (a.equals(b)) {
            return 1;
        }

        // "amoxicilina" dentro de "amoxicilina 500": mismo medicamento con otro texto alrededor.
        if (Math.min(a.length(), b.length()) >= 4 && (a.contains(b) || b.contains(a))) {
            return 0.9;
        }

        return NormalizadorTexto.similitud(a, b);
    }

    /** Quita espacios repetidos; si lo escribieron todo en mayúsculas lo pasa a "Paracetamol". */
    private String formatearNombre(String nombre) {

        String limpio = limpiar(nombre);

        if (limpio == null) {
            throw new IllegalArgumentException("El nombre del medicamento es obligatorio.");
        }

        if (limpio.equals(limpio.toUpperCase(Locale.ROOT))) {
            limpio = limpio.toLowerCase(Locale.ROOT);
        }

        return limpio.substring(0, 1).toUpperCase(Locale.ROOT) + limpio.substring(1);
    }

    /** Recorta y colapsa espacios; devuelve null si queda vacío. */
    private String limpiar(String texto) {

        if (texto == null) {
            return null;
        }

        String limpio = texto.trim().replaceAll("\\s+", " ");

        return limpio.isEmpty() ? null : limpio;
    }

    private void validarImagen(MultipartFile imagen) {

        if (imagen == null || imagen.isEmpty()) {
            return;
        }

        if (imagen.getContentType() == null || !TIPOS_IMAGEN.contains(imagen.getContentType())) {
            throw new IllegalArgumentException("La imagen debe ser JPG, PNG o WEBP.");
        }

        if (imagen.getSize() > TAMANIO_MAXIMO_IMAGEN) {
            throw new IllegalArgumentException("La imagen no puede superar los 2 MB.");
        }
    }

    private String mensajeDuplicado(String nombre, String concentracion) {

        String detalle = concentracion == null ? nombre : nombre + " " + concentracion;

        return "Ya existe el medicamento \"" + detalle + "\" en el catálogo.";
    }

    private void validarId(Integer id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID del medicamento debe ser válido.");
        }
    }

    private MedicamentoRespuestaDTO toDto(Medicamento m) {
        return new MedicamentoRespuestaDTO(
                m.getId(),
                m.getNombre(),
                m.getPrincipioActivo(),
                m.getConcentracion(),
                m.getGrupoTerapeutico(),
                m.getIndicacionTerapeutica(),
                m.getLaboratorio(),
                m.getDescripcion(),
                m.getRequiereReceta(),
                m.getFoto(),
                m.getEstado(),
                m.getFechaCreacion(),
                m.getFechaActualizacion());
    }
}