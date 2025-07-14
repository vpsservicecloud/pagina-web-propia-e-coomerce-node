import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import TarjetaProducto from '../components/TarjetaProducto';
import { buscarProductos } from '../data/productos';

const PaginaBusqueda: React.FC = () => {
  const termino = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }, []);

  const resultados = useMemo(() => {
    return termino ? buscarProductos(termino) : [];
  }, [termino]);

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <Search size={24} className="text-primary me-2" />
              <h1 className="mb-0">Resultados de búsqueda</h1>
            </div>
            
            {termino && (
              <p className="text-muted">
                {resultados.length} resultados para "{termino}"
              </p>
            )}
          </div>
        </div>

        <div className="row g-4">
          {resultados.length > 0 ? (
            resultados.map(producto => (
              <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                <TarjetaProducto producto={producto} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <Search size={64} className="text-muted mb-3" />
              <h3 className="text-muted">
                {termino ? 'No se encontraron productos' : 'Ingresa un término de búsqueda'}
              </h3>
              <p className="text-muted">
                {termino 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Usa la barra de búsqueda para encontrar productos'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaginaBusqueda;