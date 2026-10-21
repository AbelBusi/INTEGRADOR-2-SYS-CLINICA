package com.salud.consultorio.service;

public interface IValidarEmpleadoCargoServicio {

    boolean existeEmpleadoPorCargo(Integer id);

    boolean existeEmpleadoID(Integer id);

    Integer IDEmpleadoPersona(Integer id);

}
