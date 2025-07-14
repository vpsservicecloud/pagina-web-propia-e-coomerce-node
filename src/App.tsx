import React, { useState, useEffect } from 'react';
import { ProveedorCarrito } from './context/CarritoContext';
import { ProveedorAutenticacion } from './context/AutenticacionContext';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import VolverArriba from './components/VolverArriba';

// Páginas
import PaginaInicio from './pages/PaginaInicio';
import PaginaTienda from './pages/PaginaTienda';
import PaginaProducto from './pages/PaginaProducto';
import PaginaCarrito from './pages/PaginaCarrito';
import PaginaIniciarSesion from './pages/PaginaIniciarSesion';
import PaginaCuenta from './pages/PaginaCuenta';
import PaginaCategoria from './pages/PaginaCategoria';
import PaginaBusqueda from './pages/PaginaBusqueda';
import PaginaContacto from './pages/PaginaContacto';

function App() {
  const [rutaActual, setRutaActual] = useState(window.location.pathname);

  useEffect(() => {
    const manejarNavegacion = (event: any) => {
      setRutaActual(event.detail.ruta);
    };

    window.addEventListener('navegacion', manejarNavegacion);
    
    return () => {
      window.removeEventListener('navegacion', manejarNavegacion);
    };
  }, []);

  const renderizarPagina = () => {
    // Extraer parámetros de la URL
    const segmentos = rutaActual.split('/').filter(Boolean);
    
    switch (segmentos[0]) {
      case undefined:
      case '':
        return <PaginaInicio />;
      
      case 'tienda':
        return <PaginaTienda />;
      
      case 'producto':
        return <PaginaProducto idProducto={segmentos[1]} />;
      
      case 'categoria':
        return <PaginaCategoria categoria={segmentos[1]} />;
      
      case 'carrito':
        return <PaginaCarrito />;
      
      case 'iniciar-sesion':
        return <PaginaIniciarSesion />;
      
      case 'cuenta':
        return <PaginaCuenta />;
      
      case 'buscar':
        return <PaginaBusqueda />;
      
      case 'contacto':
        return <PaginaContacto />;
      
      default:
        return (
          <main className="main-content py-5">
            <div className="container">
              <div className="text-center">
                <h1>Página no encontrada</h1>
                <p className="text-muted">La página que buscas no existe.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setRutaActual('/')}
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <ProveedorAutenticacion>
      <ProveedorCarrito>
        <div className="app-container">
          <Encabezado />
          {renderizarPagina()}
          <PiePagina />
          <VolverArriba />
        </div>
      </ProveedorCarrito>
    </ProveedorAutenticacion>
  );
}

export default App;