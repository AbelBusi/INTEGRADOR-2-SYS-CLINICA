package com.salud.consultorio.model.enums;

public enum MotivoRegularizacionAdministrativa {
    NO_REALIZADA_ESTABLECIMIENTO(true),
    SUSPENDIDA_INSTITUCIONAL(true),
    CANCELADA_PACIENTE(false);

    private final boolean permiteReprogramar;

    MotivoRegularizacionAdministrativa(boolean permiteReprogramar) {
        this.permiteReprogramar = permiteReprogramar;
    }

    public boolean permiteReprogramar() {
        return permiteReprogramar;
    }
}