import React from 'react';
import TarjetaProducto from './TarjetaProducto';
import { obtenerProductosDestacados } from '../data/productos';
import { useNavegacion } from '../hooks/useNavegacion';

const ProductosDestacados: React.FC = () => {
  const { navegarA } = useNavegacion();
  const [productos, setProductos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  
  React.useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      setCargando(true);
      const productosDestacados = await obtenerProductosDestacados(4);
      setProductos(productosDestacados);
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    } finally {
      setCargando(false);
    }
  };

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
          {cargando ? (
            // Skeleton loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="card">
                  <div className="placeholder-glow">
                    <div className="placeholder bg-secondary" style={{ height: '200px' }}></div>
                  </div>
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                      <span className="placeholder col-6"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : productos.length > 0 ? (
            productos.map(producto => (
              <div key={producto.id} className="col-6 col-md-3">
                <TarjetaProducto producto={producto} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No hay productos destacados disponibles</p>
            </div>
          )}
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