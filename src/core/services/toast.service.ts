import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  mensaje: string;
  tipo: ToastType;
}

export interface ConfirmConfig {
  titulo: string;
  mensaje: string;
  resolver: (value: boolean) => void;
}


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<ToastConfig | null>(null);
  confirmacion = signal<ConfirmConfig | null>(null); // <-- Signal para la alerta de confirmación

  show(mensaje: string, tipo: ToastType = 'info', duration: number = 4000): void {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), duration);
  }

  success(mensaje: string): void {
    this.show(mensaje, 'success');
  }
  error(mensaje: string): void {
    this.show(mensaje, 'error');
  }
  info(mensaje: string): void {
    this.show(mensaje, 'info');
  }
  warning(mensaje: string): void {
    this.show(mensaje, 'warning');
  }

  confirmar(titulo: string, mensaje: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmacion.set({
        titulo,
        mensaje,
        resolver: resolve,
      });
    });
  }

  aceptarConfirmacion(): void {
    const conf = this.confirmacion();
    if (conf) {
      conf.resolver(true);
      this.confirmacion.set(null);
    }
  }

  cancelarConfirmacion(): void {
    const conf = this.confirmacion();
    if (conf) {
      conf.resolver(false);
      this.confirmacion.set(null);
    }
  }
}
