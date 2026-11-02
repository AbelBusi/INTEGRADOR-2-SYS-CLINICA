export function descargarArchivo(url: string, nombre: string): void {
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `${nombre}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}

export function abrirEnPestana(url: string): void {
  window.open(url, '_blank', 'noopener');
}

export function imprimirArchivo(url: string): void {
  const marco = document.createElement('iframe');
  marco.style.position = 'fixed';
  marco.style.right = '0';
  marco.style.bottom = '0';
  marco.style.width = '0';
  marco.style.height = '0';
  marco.style.border = '0';
  marco.setAttribute('aria-hidden', 'true');

  marco.onload = () => {
    setTimeout(() => {
      marco.contentWindow?.focus();
      marco.contentWindow?.print();
    }, 250);
    setTimeout(() => marco.remove(), 60000);
  };

  marco.src = url;
  document.body.appendChild(marco);
}
