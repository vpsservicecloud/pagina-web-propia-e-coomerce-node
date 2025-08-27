import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Producto, ItemCarrito } from '../types';
import { carritoService } from '../services/supabase';

interface EstadoCarrito {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number;
}

type AccionCarrito =
  | { type: 'ESTABLECER_CARRITO'; payload: any }
  | { type: 'LIMPIAR_CARRITO' }
  | { type: 'ESTABLECER_CARGANDO'; payload: boolean };

const estadoInicial: EstadoCarrito = {
  items: [],
  total: 0,
  cantidadTotal: 0
};

function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.type) {
    case 'ESTABLECER_CARRITO': {
      const carrito = accion.payload;
      return {
        items: carrito.items || [],
        total: carrito.resumen?.total || 0,
        cantidadTotal: carrito.resumen?.cantidad_items || 0
      };
    }
    
    case 'LIMPIAR_CARRITO':
      return estadoInicial;
    
    default:
      return estado;
  }
}

interface ContextoCarrito extends EstadoCarrito {
  cargando: boolean;
  agregarProducto: (producto: Producto) => Promise<void>;
  eliminarProducto: (itemId: number) => Promise<void>;
  actualizarCantidad: (itemId: number, cantidad: number) => Promise<void>;
  limpiarCarrito: () => Promise<void>;
  cargarCarrito: () => Promise<void>;
}

const CarritoContext = createContext<ContextoCarrito | undefined>(undefined);

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);
  const [cargando, setCargando] = React.useState(false);
  
  // Cargar carrito al inicializar
  React.useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      const respuesta = await carritoService.obtenerCarrito();
      if (respuesta.exito) {
        dispatch({ type: 'ESTABLECER_CARRITO', payload: respuesta.datos });
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setCargando(false);
    }
  };
  
  const agregarProducto = async (producto: Producto) => {
    try {
      setCargando(true);
      const respuesta = await carritoService.agregarProducto(producto.id, 1);
      if (respuesta.exito) {
        await cargarCarrito();
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  };
  
  const eliminarProducto = async (itemId: string) => {
    try {
      setCargando(true);
      const respuesta = await carritoService.eliminarProducto(itemId);
      if (respuesta.exito) {
        await cargarCarrito();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  };
  
  const actualizarCantidad = async (itemId: string, cantidad: number) => {
    try {
      setCargando(true);
      const respuesta = await carritoService.actualizarCantidad(itemId, cantidad);
      if (respuesta.exito) {
        await cargarCarrito();
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  };
  
  const limpiarCarrito = async () => {
    try {
      setCargando(true);
      const respuesta = await carritoService.limpiarCarrito();
      if (respuesta.exito) {
        dispatch({ type: 'LIMPIAR_CARRITO' });
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  };
  
  return (
    <CarritoContext.Provider value={{
      ...estado,
      cargando,
      agregarProducto,
      eliminarProducto,
      actualizarCantidad,
      limpiarCarrito,
      cargarCarrito
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (contexto === undefined) {
    throw new Error('useCarrito debe usarse dentro de un ProveedorCarrito');
  }
  return contexto;
}