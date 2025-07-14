import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useNavegacion } from '../hooks/useNavegacion';

const PaginaCarrito: React.FC = () => {
  const { items, total, actualizarCantidad, eliminarProducto, limpiarCarrito } = useCarrito();
  const { estaAutenticado } = useAutenticacion();
  const { navegarA } = useNavegacion();

  const manejarProcederPago = () => {
    if (!estaAutenticado) {
      navegarA('/iniciar-sesion?redirect=/checkout');
    } else {
      navegarA('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <main className="main-content py-5">
        <div className="container">
          <div className="text-center py-5">
            <ShoppingBag size={64} className="text-muted mb-3" />
            <h2>Tu carrito está vacío</h2>
            <p className="text-muted mb-4">Agrega algunos productos para comenzar a comprar</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navegarA('/tienda')}
            >
              Ir a la Tienda
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Carrito de Compras</h1>
              <button 
                className="btn btn-outline-danger"
                onClick={limpiarCarrito}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Items del carrito */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body p-0">
                {items.map((item) => (
                  <div key={item.producto.id} className="border-bottom p-4">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <img 
                          src={item.producto.imagen}
                          alt={item.producto.nombre}
                          className="img-fluid rounded"
                          style={{ height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div className="col-md-4">
                        <h5 className="mb-1">{item.producto.nombre}</h5>
                        <p className="text-muted small mb-0">
                          {item.producto.descripcion.substring(0, 60)}...
                        </p>
                      </div>
                      
                      <div className="col-md-2">
                        <span className="fw-bold">${item.producto.precio.toFixed(2)}</span>
                      </div>
                      
                      <div className="col-md-2">
                        <div className="input-group">
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <input 
                            type="number" 
                            className="form-control form-control-sm text-center"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(item.producto.id, parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-1">
                        <span className="fw-bold">
                          ${(item.producto.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="col-md-1">
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarProducto(item.producto.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span>{total >= 50 ? 'Gratis' : '$5.99'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Impuestos:</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>
                    ${(total + (total >= 50 ? 0 : 5.99) + (total * 0.1)).toFixed(2)}
                  </strong>
                </div>
                
                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  onClick={manejarProcederPago}
                >
                  {estaAutenticado ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
                </button>
                
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navegarA('/tienda')}
                >
                  Continuar Comprando
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="card-title">Información de Envío</h6>
                <ul className="list-unstyled small">
                  <li>• Envío gratis en pedidos superiores a $50</li>
                  <li>• Entrega en 2-3 días hábiles</li>
                  <li>• Seguimiento incluido</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaCarrito;