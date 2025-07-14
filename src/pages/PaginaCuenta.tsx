import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useNavegacion } from '../hooks/useNavegacion';

const PaginaCuenta: React.FC = () => {
  const [pestañaActiva, setPestañaActiva] = useState('perfil');
  const { usuario, cerrarSesion } = useAutenticacion();
  const { navegarA } = useNavegacion();

  if (!usuario) {
    navegarA('/iniciar-sesion');
    return null;
  }

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegarA('/');
  };

  // Datos de ejemplo para pedidos
  const pedidos = [
    { id: '12345', fecha: '2025-04-15', estado: 'entregado', total: 125.99 },
    { id: '12346', fecha: '2025-04-10', estado: 'procesando', total: 79.50 },
    { id: '12347', fecha: '2025-03-28', estado: 'entregado', total: 214.75 }
  ];

  // Productos favoritos de ejemplo
  const favoritos = [
    { id: '1', nombre: 'Camiseta Premium', precio: 29.99, imagen: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg' },
    { id: '2', nombre: 'Jeans Clásicos', precio: 59.99, imagen: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg' }
  ];

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <User size={32} className="text-primary" />
                  </div>
                  <h5 className="mb-0">{usuario.nombre} {usuario.apellido}</h5>
                  <p className="text-muted small">{usuario.email}</p>
                </div>
                
                <ul className="nav flex-column account-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${pestañaActiva === 'perfil' ? 'active' : ''}`}
                      onClick={() => setPestañaActiva('perfil')}
                    >
                      <User size={16} className="me-2" /> Perfil
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${pestañaActiva === 'pedidos' ? 'active' : ''}`}
                      onClick={() => setPestañaActiva('pedidos')}
                    >
                      <Package size={16} className="me-2" /> Pedidos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${pestañaActiva === 'favoritos' ? 'active' : ''}`}
                      onClick={() => setPestañaActiva('favoritos')}
                    >
                      <Heart size={16} className="me-2" /> Favoritos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${pestañaActiva === 'direcciones' ? 'active' : ''}`}
                      onClick={() => setPestañaActiva('direcciones')}
                    >
                      <MapPin size={16} className="me-2" /> Direcciones
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${pestañaActiva === 'configuracion' ? 'active' : ''}`}
                      onClick={() => setPestañaActiva('configuracion')}
                    >
                      <Settings size={16} className="me-2" /> Configuración
                    </button>
                  </li>
                </ul>
                
                <hr className="my-3" />
                
                <button 
                  className="btn btn-outline-danger w-100"
                  onClick={manejarCerrarSesion}
                >
                  <LogOut size={16} className="me-2" /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-9">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {pestañaActiva === 'perfil' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">Mi Perfil</h3>
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="nombre" className="form-label">Nombre</label>
                          <input type="text" className="form-control" id="nombre" defaultValue={usuario.nombre} />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="apellido" className="form-label">Apellido</label>
                          <input type="text" className="form-control" id="apellido" defaultValue={usuario.apellido} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" defaultValue={usuario.email} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input type="tel" className="form-control" id="telefono" defaultValue={usuario.telefono} />
                      </div>
                      <div className="d-grid d-md-flex justify-content-md-end">
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                      </div>
                    </form>
                  </div>
                )}
                
                {pestañaActiva === 'pedidos' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">Mis Pedidos</h3>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID Pedido</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                              <td>#{pedido.id}</td>
                              <td>{pedido.fecha}</td>
                              <td>
                                <span className={`badge bg-${pedido.estado === 'entregado' ? 'success' : 'warning'}`}>
                                  {pedido.estado}
                                </span>
                              </td>
                              <td>${pedido.total}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  Ver Detalles
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {pestañaActiva === 'favoritos' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">Mis Favoritos</h3>
                    <div className="row g-4">
                      {favoritos.map(producto => (
                        <div key={producto.id} className="col-md-6">
                          <div className="card product-card">
                            <div className="row g-0">
                              <div className="col-4">
                                <img 
                                  src={producto.imagen} 
                                  className="img-fluid rounded-start h-100" 
                                  alt={producto.nombre}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="col-8">
                                <div className="card-body">
                                  <h5 className="card-title">{producto.nombre}</h5>
                                  <p className="card-text product-price">${producto.precio}</p>
                                  <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-primary">
                                      Ver Producto
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger">
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {pestañaActiva === 'direcciones' && (
                  <div className="tab-content fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Mis Direcciones</h3>
                      <button className="btn btn-primary">
                        Agregar Nueva
                      </button>
                    </div>
                    
                    <div className="row g-4">
                      {usuario.direcciones.map(direccion => (
                        <div key={direccion.id} className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">
                                {direccion.nombre} 
                                {direccion.esPredeterminada && (
                                  <span className="badge bg-primary ms-2">Predeterminada</span>
                                )}
                              </h5>
                              <address className="mb-3">
                                {direccion.direccion}<br />
                                {direccion.ciudad}, {direccion.codigoPostal}<br />
                                {direccion.pais}<br />
                                <strong>Teléfono:</strong> {direccion.telefono}
                              </address>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-primary">Editar</button>
                                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {pestañaActiva === 'configuracion' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">Configuración de la Cuenta</h3>
                    
                    <div className="mb-4">
                      <h5>Cambiar Contraseña</h5>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="contraseñaActual" className="form-label">Contraseña Actual</label>
                          <input type="password" className="form-control" id="contraseñaActual" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="nuevaContraseña" className="form-label">Nueva Contraseña</label>
                          <input type="password" className="form-control" id="nuevaContraseña" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirmarContraseña" className="form-label">Confirmar Nueva Contraseña</label>
                          <input type="password" className="form-control" id="confirmarContraseña" />
                        </div>
                        <button type="submit" className="btn btn-primary">Actualizar Contraseña</button>
                      </form>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="mb-4">
                      <h5>Preferencias de Notificación</h5>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="notificacionesEmail" defaultChecked />
                        <label className="form-check-label" htmlFor="notificacionesEmail">
                          Notificaciones por Email
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="notificacionesSMS" />
                        <label className="form-check-label" htmlFor="notificacionesSMS">
                          Notificaciones por SMS
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="emailsMarketing" defaultChecked />
                        <label className="form-check-label" htmlFor="emailsMarketing">
                          Emails de Marketing
                        </label>
                      </div>
                      <button className="btn btn-primary">Guardar Preferencias</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaCuenta;