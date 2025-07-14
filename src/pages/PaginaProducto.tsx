import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductoPorId } from '../data/productos';

interface PropsPaginaProducto {
  idProducto: string;
}

const PaginaProducto: React.FC<PropsPaginaProducto> = ({ idProducto }) => {
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  
  const { agregarProducto } = useCarrito();
  const producto = obtenerProductoPorId(idProducto);

  if (!producto) {
    return (
      <main className="main-content py-5">
        <div className="container">
          <div className="text-center">
            <h2>Producto no encontrado</h2>
            <p className="text-muted">El producto que buscas no existe o ha sido eliminado.</p>
          </div>
        </div>
      </main>
    );
  }

  const imagenes = producto.imagenes || [producto.imagen];
  const precioConDescuento = producto.descuento 
    ? producto.precio * (1 - producto.descuento / 100)
    : producto.precio;

  const manejarAgregarCarrito = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto(producto);
    }
    
    // Mostrar notificación
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed';
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${cantidad} ${cantidad === 1 ? 'producto agregado' : 'productos agregados'} al carrito
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    document.body.appendChild(toast);
    
    const bsToast = new (window as any).bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
      document.body.removeChild(toast);
    });
  };

  return (
    <main className="main-content py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item"><a href="/tienda">Tienda</a></li>
            <li className="breadcrumb-item active">{producto.nombre}</li>
          </ol>
        </nav>

        <div className="row">
          {/* Galería de imágenes */}
          <div className="col-md-6 mb-4">
            <div className="product-gallery">
              <div className="main-image mb-3">
                <img 
                  src={imagenes[imagenActual]} 
                  alt={producto.nombre}
                  className="img-fluid rounded shadow"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
              </div>
              
              {imagenes.length > 1 && (
                <div className="thumbnail-images">
                  <div className="row g-2">
                    {imagenes.map((imagen, index) => (
                      <div key={index} className="col-3">
                        <img 
                          src={imagen}
                          alt={`${producto.nombre} ${index + 1}`}
                          className={`img-fluid rounded cursor-pointer ${index === imagenActual ? 'border border-primary' : ''}`}
                          style={{ height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => setImagenActual(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="col-md-6">
            <div className="product-info">
              {/* Insignias */}
              <div className="mb-2">
                {producto.esNuevo && (
                  <span className="badge bg-info me-2">Nuevo</span>
                )}
                {producto.descuento && (
                  <span className="badge bg-danger">-{producto.descuento}%</span>
                )}
              </div>

              <h1 className="mb-3">{producto.nombre}</h1>
              
              {/* Calificación */}
              <div className="d-flex align-items-center mb-3">
                <div className="stars me-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16} className="text-warning" fill="currentColor" />
                  ))}
                </div>
                <span className="text-muted">(4.5) 123 reseñas</span>
              </div>

              {/* Precio */}
              <div className="price mb-4">
                {producto.descuento ? (
                  <>
                    <span className="h3 text-danger me-3">${precioConDescuento.toFixed(2)}</span>
                    <span className="h5 text-muted text-decoration-line-through">
                      ${producto.precio.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="h3">${producto.precio.toFixed(2)}</span>
                )}
              </div>

              {/* Descripción */}
              <p className="mb-4">{producto.descripcion}</p>

              {/* Opciones del producto */}
              {producto.especificaciones?.Talla && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Talla:</label>
                  <div className="d-flex gap-2">
                    {producto.especificaciones.Talla.split(', ').map(talla => (
                      <button
                        key={talla}
                        className={`btn btn-outline-secondary ${tallaSeleccionada === talla ? 'active' : ''}`}
                        onClick={() => setTallaSeleccionada(talla)}
                      >
                        {talla}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {producto.especificaciones?.Color && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Color:</label>
                  <div className="d-flex gap-2">
                    {producto.especificaciones.Color.split(', ').map(color => (
                      <button
                        key={color}
                        className={`btn btn-outline-secondary ${colorSeleccionado === color ? 'active' : ''}`}
                        onClick={() => setColorSeleccionado(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="mb-4">
                <label className="form-label fw-bold">Cantidad:</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{ width: '120px' }}>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center"
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={producto.stock}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-muted">
                    {producto.stock} disponibles
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="d-flex gap-3 mb-4">
                <button 
                  className="btn btn-primary btn-lg flex-grow-1"
                  onClick={manejarAgregarCarrito}
                  disabled={producto.stock === 0}
                >
                  <ShoppingCart size={20} className="me-2" />
                  {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
                <button className="btn btn-outline-secondary btn-lg">
                  <Heart size={20} />
                </button>
              </div>

              {/* Información adicional */}
              <div className="additional-info">
                <div className="d-flex align-items-center mb-2">
                  <Truck size={16} className="text-primary me-2" />
                  <span className="small">Envío gratis en pedidos superiores a $50</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <RotateCcw size={16} className="text-primary me-2" />
                  <span className="small">Devoluciones gratuitas dentro de 30 días</span>
                </div>
                <div className="d-flex align-items-center">
                  <Shield size={16} className="text-primary me-2" />
                  <span className="small">Garantía de 2 años</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones */}
        {producto.especificaciones && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="mb-0">Especificaciones</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                      <div key={clave} className="col-md-6 mb-2">
                        <strong>{clave}:</strong> {valor}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaginaProducto;