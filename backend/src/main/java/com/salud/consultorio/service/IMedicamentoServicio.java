package com.salud.consultorio.service;

import com.salud.consultorio.dto.medicamento.*;
import com.salud.consultorio.model.enums.EntidadEstado;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IMedicamentoServicio {

    List<MedicamentoRespuestaDTO> lista(EntidadEstado estado);

    MedicamentoRespuestaDTO entidadPorID(Integer id);

    MedicamentoRespuestaDTO crear(MedicamentoCrearDTO dto, MultipartFile imagen);

    MedicamentoRespuestaDTO actualizar(MedicamentoActualizarDTO dto, Integer id, MultipartFile imagen);

    void cambiarEstado(Integer id, EntidadEstado estado);

    void eliminarPorId(Integer id);

    /** Medicamentos ya registrados con un nombre parecido (para evitar duplicados mal escritos). */
    List<MedicamentoSimilarDTO> similares(String nombre, Integer idExcluir);

    /** Buscador para otros módulos (Tratamiento): solo activos, desde 3 caracteres, con foto. */
    List<MedicamentoBusquedaDTO> buscar(String texto);
}