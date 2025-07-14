import React from 'react';
import TarjetaProducto from './TarjetaProducto';
import { productos } from '../data/productos';
import { useNavegacion } from '../hooks/useNavegacion';

const ProductosDestacados: React.FC = () => {
  const { navegarA } = useNavegacion();
  
  // Mostrar solo los primeros 4 productos
  const productosDestacados = productos.slice(0, 4);

  return (
    <section className="featured-products py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold mb-2">Productos Destacados</h2>
            <p className="text-muted">Descubre nuestros productos cuidadosamente seleccionados</p>
          </div>
        </div>
        
        <div className="row g-4">
          {productosDestacados.map(producto => (
            <div key={producto.id} className="col-6 col-md-3">
              <TarjetaProducto producto={producto} />
            </div>
          ))}
        </div>
        
        <div className="row mt-5">
          <div className="col-12 text-center">
            <button 
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={() => navegarA('/tienda')}
            >
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductosDestacados;