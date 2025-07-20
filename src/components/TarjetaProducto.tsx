import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Producto } from '../types';
import { useCarrito } from '../context/CarritoContext';
import { useNavegacion } from '../hooks/useNavegacion';

interface PropsTarjetaProducto {
  producto: Producto;
}

const TarjetaProducto: React.FC<PropsTarjetaProducto> = ({ producto }) => {
  const { agregarProducto } = useCarrito();
  const { navegarA } = useNavegacion();

  const manejarAgregarCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    agregarProducto(producto)
      .then(() => {
        // Mostrar notificación de éxito
        mostrarNotificacion('Producto agregado al carrito', 'success');
      })
      .catch((error) => {
        // Mostrar notificación de error
        mostrarNotificacion('Error al agregar producto', 'error');
        console.error('Error al agregar producto:', error);
      });
  };

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error') => {
    const toast = document.createElement('div');
    const bgClass = tipo === 'success' ? 'bg-success' : 'bg-danger';
    toast.className = `toast align-items-center text-white ${bgClass} border-0 position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Inicializar y mostrar el toast
    const bsToast = new (window as any).bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover el elemento después de que se oculte
    toast.addEventListener('hidden.bs.toast', () => {
      document.body.removeChild(toast);
    });
  };

  const precioConDescuento = producto.precio_oferta || producto.precio;
  const tieneDescuento = producto.precio_oferta && producto.precio_oferta < producto.precio;

  return (
    <div className="product-card card h-100">
      <div className="position-relative">
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navegarA(`/producto/${producto.id}`)}
        />
        
        {/* Insignias del producto */}
        <div className="position-absolute top-0 start-0 p-2">
          {producto.nuevo && (
            <span className="badge bg-info me-2">Nuevo</span>
          )}
          {tieneDescuento && (
            <span className="badge bg-danger">
              -{Math.round(((producto.precio - producto.precio_oferta) / producto.precio) * 100)}%
            </span>
          )}
        </div>
        
        {/* Acciones rápidas */}
        <div className="position-absolute top-0 end-0 p-2">
          <button 
            className="btn btn-sm btn-light rounded-circle shadow-sm"
            title="Agregar a favoritos"
          >
            <Heart size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="card-title mb-1">
          <a 
            href="#" 
            className="text-decoration-none text-dark stretched-link"
            onClick={(e) => {
              e.preventDefault();
              navegarA(`/producto/${producto.id}`);
            }}
          >
            {producto.nombre}
          </a>
        </h5>
        
        <p className="card-text text-muted small mb-2 flex-grow-1">
          {producto.descripcion.substring(0, 80)}...
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="product-price">
            {tieneDescuento ? (
              <>
                <span className="text-danger fw-bold">${precioConDescuento.toFixed(2)}</span>
                <small className="text-muted text-decoration-line-through ms-2">
                  ${producto.precio.toFixed(2)}
                </small>
              </>
            ) : (
              <span className="fw-bold">${precioConDescuento.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            className="btn btn-sm btn-primary rounded-pill"
            onClick={manejarAgregarCarrito}
            disabled={producto.stock === 0}
          >
            <ShoppingCart size={16} className="me-1" />
            {producto.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
        
        {producto.stock > 0 && producto.stock <= 5 && (
          <small className="text-warning mt-1">
            ¡Solo quedan {producto.stock} unidades!
          </small>
        )}
      </div>
    </div>
  );
};

export default TarjetaProducto;