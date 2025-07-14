import { useState } from 'react';

// Hook personalizado para manejar la navegación
export function useNavegacion() {
  const [paginaActual, setPaginaActual] = useState('/');

  const navegarA = (ruta: string) => {
    setPaginaActual(ruta);
    window.history.pushState({}, '', ruta);
    
    // Disparar evento personalizado para que otros componentes puedan escuchar
    window.dispatchEvent(new CustomEvent('navegacion', { detail: { ruta } }));
  };

  const obtenerPaginaActual = () => {
    return window.location.pathname || paginaActual;
  };

  return {
    paginaActual: obtenerPaginaActual(),
    navegarA
  };
}