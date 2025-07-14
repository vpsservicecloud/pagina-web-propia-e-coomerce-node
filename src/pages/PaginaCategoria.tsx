import React, { useMemo } from 'react';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerProductosPorCategoria } from '../data/productos';

interface PropsPaginaCategoria {
  categoria: string;
}

const PaginaCategoria: React.FC<PropsPaginaCategoria> = ({ categoria }) => {
  const productos = useMemo(() => {
    return obtenerProductosPorCategoria(categoria);
  }, [categoria]);

  const nombreCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                <li className="breadcrumb-item"><a href="/tienda">Tienda</a></li>
                <li className="breadcrumb-item active">{nombreCategoria}</li>
              </ol>
            </nav>
            
            <h1 className="mb-2">{nombreCategoria}</h1>
            <p className="text-muted">
              {productos.length} productos encontrados en {nombreCategoria.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {productos.length > 0 ? (
            productos.map(producto => (
              <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                <TarjetaProducto producto={producto} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">No hay productos en esta categoría</h3>
              <p className="text-muted">Vuelve pronto para ver nuevos productos</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaginaCategoria;