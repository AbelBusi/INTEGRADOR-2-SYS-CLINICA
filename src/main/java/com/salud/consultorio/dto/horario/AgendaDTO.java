package com.salud.consultorio.dto.horario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgendaDTO {

    private List<AgendaBloqueDTO> bloques;
    private List<AgendaCitaDTO> citas;

}
