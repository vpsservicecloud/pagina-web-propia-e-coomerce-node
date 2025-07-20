import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import TarjetaProducto from '../components/TarjetaProducto';
import { productosAPI } from '../services/api';
import { Producto } from '../types';

const PaginaTienda: React.FC = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [ordenamiento, setOrdenamiento] = useState('nombre');
  const [vistaGrid, setVistaGrid] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Función para obtener productos de la API
  const cargarProductos = async () => {
    setCargando(true);
    try {
      // Preparar parámetros para la API
      const filtros: any = {};
      
      if (filtroCategoria !== 'todas') {
        filtros.categoria = filtroCategoria;
      }
      
      // Convertir ordenamiento a formato de API
      switch (ordenamiento) {
        case 'precio-asc':
          filtros.ordenar = 'precio';
          filtros.direccion = 'asc';
          break;
        case 'precio-desc':
          filtros.ordenar = 'precio';
          filtros.direccion = 'desc';
          break;
        case 'nombre':
          filtros.ordenar = 'nombre';
          filtros.direccion = 'asc';
          break;
      }

      const respuesta = await productosAPI.obtenerProductos(filtros);
      if (respuesta.exito) {
        setProductos(respuesta.datos.productos || []);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    cargarProductos();
  }, [filtroCategoria, ordenamiento]);

  const categorias = [
    { valor: 'todas', etiqueta: 'Todas las categorías' },
    { valor: 'ropa', etiqueta: 'Ropa' },
    { valor: 'calzado', etiqueta: 'Calzado' },
    { valor: 'accesorios', etiqueta: 'Accesorios' },
    { valor: 'electronicos', etiqueta: 'Electrónicos' },
    { valor: 'hogar', etiqueta: 'Hogar' },
    { valor: 'belleza', etiqueta: 'Belleza' }
  ];

  return (
    <main className="main-content py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-2">Nuestra Tienda</h1>
            <p className="text-muted">Descubre nuestra amplia selección de productos de calidad</p>
          </div>
        </div>

        {/* Filtros y controles */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="d-flex gap-3">
              <select 
                className="form-select"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                disabled={cargando}
              >
                {categorias.map(categoria => (
                  <option key={categoria.valor} value={categoria.valor}>
                    {categoria.etiqueta}
                  </option>
                ))}
              </select>
              
              <select 
                className="form-select"
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                disabled={cargando}
              >
                <option value="nombre">Ordenar por nombre</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end align-items-center gap-2">
              <span className="text-muted small">
                {cargando ? 'Cargando...' : `${productos.length} productos encontrados`}
              </span>
              
              <div className="btn-group" role="group">
                <button 
                  className={`btn btn-outline-secondary ${vistaGrid ? 'active' : ''}`}
                  onClick={() => setVistaGrid(true)}
                  disabled={cargando}
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`btn btn-outline-secondary ${!vistaGrid ? 'active' : ''}`}
                  onClick={() => setVistaGrid(false)}
                  disabled={cargando}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="row">
          {cargando ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando productos...</p>
            </div>
          ) : productos.length > 0 ? (
            productos.map(producto => (
              <div 
                key={producto.id} 
                className={vistaGrid ? 'col-6 col-md-4 col-lg-3 mb-4' : 'col-12 mb-3'}
              >
                {vistaGrid ? (
                  <TarjetaProducto producto={producto} />
                ) : (
                  <div className="card">
                    <div className="row g-0">
                      <div className="col-md-3">
                        <img 
                          src={producto.imagen} 
                          className="img-fluid rounded-start h-100" 
                          alt={producto.nombre}
                          style={{ objectFit: 'cover', minHeight: '150px' }}
                        />
                      </div>
                      <div className="col-md-9">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title">{producto.nombre}</h5>
                              <p className="card-text text-muted">{producto.descripcion}</p>
                              <p className="card-text">
                                <span className="fw-bold text-primary fs-5">
                                  ${producto.precio.toFixed(2)}
                                </span>
                              </p>
                            </div>
                            <button className="btn btn-primary">
                              Agregar al carrito
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">No se encontraron productos</h3>
              <p className="text-muted">Intenta cambiar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaginaTienda;