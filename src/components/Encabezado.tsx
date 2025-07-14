import React, { useState } from 'react';
import { Menu, ShoppingCart, User, Search, LogOut } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useNavegacion } from '../hooks/useNavegacion';

const Encabezado: React.FC = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const { cantidadTotal } = useCarrito();
  const { usuario, estaAutenticado, cerrarSesion } = useAutenticacion();
  const { navegarA } = useNavegacion();

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) {
      navegarA(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
    }
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegarA('/');
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Logo */}
          <a 
            className="navbar-brand fw-bold fs-3 text-primary" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navegarA('/');
            }}
          >
            TiendaOnline
          </a>
          
          {/* Iconos móviles */}
          <div className="d-flex d-lg-none ms-auto me-2">
            <button 
              className="btn btn-link position-relative p-1 me-2"
              onClick={() => navegarA('/carrito')}
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cantidadTotal > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {cantidadTotal}
                </span>
              )}
            </button>
            
            {estaAutenticado ? (
              <div className="dropdown">
                <button 
                  className="btn btn-link p-1" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={22} strokeWidth={1.5} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => navegarA('/cuenta')}
                    >
                      Mi Cuenta
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={manejarCerrarSesion}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button 
                className="btn btn-link p-1"
                onClick={() => navegarA('/iniciar-sesion')}
              >
                <User size={22} strokeWidth={1.5} />
              </button>
            )}
          </div>
          
          {/* Toggle móvil */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarMain"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          {/* Contenido del navbar */}
          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Navegación principal */}
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a 
                  className="nav-link px-3" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navegarA('/');
                  }}
                >
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link px-3" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navegarA('/tienda');
                  }}
                >
                  Tienda
                </a>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle px-3" 
                  href="#" 
                  data-bs-toggle="dropdown"
                >
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/ropa'); }}>Ropa</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/calzado'); }}>Calzado</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/accesorios'); }}>Accesorios</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/electronicos'); }}>Electrónicos</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/hogar'); }}>Hogar</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navegarA('/categoria/belleza'); }}>Belleza</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link px-3" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navegarA('/contacto');
                  }}
                >
                  Contacto
                </a>
              </li>
            </ul>
            
            {/* Búsqueda y cuenta (escritorio) */}
            <div className="d-none d-lg-flex">
              <form className="search-form me-3" onSubmit={manejarBusqueda}>
                <div className="input-group">
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="Buscar productos..." 
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
              
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-link position-relative p-1 me-2"
                  onClick={() => navegarA('/carrito')}
                >
                  <ShoppingCart size={22} strokeWidth={1.5} />
                  {cantidadTotal > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                      {cantidadTotal}
                    </span>
                  )}
                </button>
                
                {estaAutenticado ? (
                  <div className="dropdown">
                    <button 
                      className="btn btn-primary rounded-pill px-4 dropdown-toggle" 
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {usuario?.nombre}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => navegarA('/cuenta')}
                        >
                          <User size={16} className="me-2" />
                          Mi Cuenta
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => navegarA('/pedidos')}
                        >
                          Mis Pedidos
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={manejarCerrarSesion}
                        >
                          <LogOut size={16} className="me-2" />
                          Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary rounded-pill px-4"
                    onClick={() => navegarA('/iniciar-sesion')}
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Encabezado;