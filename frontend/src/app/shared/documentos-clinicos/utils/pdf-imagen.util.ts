import { ImagenPdf } from '../interface/documento-clinico.interface';

function leerComoDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result));
    lector.onerror = () => reject(lector.error);
    lector.readAsDataURL(blob);
  });
}

function medirImagen(dataUrl: string): Promise<{ ancho: number; alto: number }> {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.onload = () => resolve({ ancho: imagen.naturalWidth, alto: imagen.naturalHeight });
    imagen.onerror = () => reject(new Error('No se pudo leer la imagen'));
    imagen.src = dataUrl;
  });
}

export async function cargarImagenPdf(url: string): Promise<ImagenPdf | null> {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      return null;
    }

    const blob = await respuesta.blob();
    const tipo = blob.type.toLowerCase();
    const formato = tipo.includes('png')
      ? 'PNG'
      : tipo.includes('jpeg') || tipo.includes('jpg')
        ? 'JPEG'
        : null;

    if (!formato) {
      return null;
    }

    const dataUrl = await leerComoDataUrl(blob);
    const { ancho, alto } = await medirImagen(dataUrl);

    return { dataUrl, formato, ancho, alto };
  } catch {
    return null;
  }
}
