import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Producto, ItemCarrito } from '../types';

interface EstadoCarrito {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number;
}

type AccionCarrito =
  | { type: 'AGREGAR_PRODUCTO'; payload: Producto }
  | { type: 'ELIMINAR_PRODUCTO'; payload: string }
  | { type: 'ACTUALIZAR_CANTIDAD'; payload: { id: string; cantidad: number } }
  | { type: 'LIMPIAR_CARRITO' };

const estadoInicial: EstadoCarrito = {
  items: [],
  total: 0,
  cantidadTotal: 0
};

function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.type) {
    case 'AGREGAR_PRODUCTO': {
      const productoExistente = estado.items.find(item => item.producto.id === accion.payload.id);
      
      let nuevosItems: ItemCarrito[];
      if (productoExistente) {
        nuevosItems = estado.items.map(item =>
          item.producto.id === accion.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        nuevosItems = [...estado.items, { producto: accion.payload, cantidad: 1 }];
      }
      
      const nuevoTotal = nuevosItems.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
      const nuevaCantidadTotal = nuevosItems.reduce((total, item) => total + item.cantidad, 0);
      
      return {
        items: nuevosItems,
        total: nuevoTotal,
        cantidadTotal: nuevaCantidadTotal
      };
    }
    
    case 'ELIMINAR_PRODUCTO': {
      const nuevosItems = estado.items.filter(item => item.producto.id !== accion.payload);
      const nuevoTotal = nuevosItems.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
      const nuevaCantidadTotal = nuevosItems.reduce((total, item) => total + item.cantidad, 0);
      
      return {
        items: nuevosItems,
        total: nuevoTotal,
        cantidadTotal: nuevaCantidadTotal
      };
    }
    
    case 'ACTUALIZAR_CANTIDAD': {
      const nuevosItems = estado.items.map(item =>
        item.producto.id === accion.payload.id
          ? { ...item, cantidad: accion.payload.cantidad }
          : item
      ).filter(item => item.cantidad > 0);
      
      const nuevoTotal = nuevosItems.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
      const nuevaCantidadTotal = nuevosItems.reduce((total, item) => total + item.cantidad, 0);
      
      return {
        items: nuevosItems,
        total: nuevoTotal,
        cantidadTotal: nuevaCantidadTotal
      };
    }
    
    case 'LIMPIAR_CARRITO':
      return estadoInicial;
    
    default:
      return estado;
  }
}

interface ContextoCarrito extends EstadoCarrito {
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  limpiarCarrito: () => void;
}

const CarritoContext = createContext<ContextoCarrito | undefined>(undefined);

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);
  
  const agregarProducto = (producto: Producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto });
  };
  
  const eliminarProducto = (id: string) => {
    dispatch({ type: 'ELIMINAR_PRODUCTO', payload: id });
  };
  
  const actualizarCantidad = (id: string, cantidad: number) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { id, cantidad } });
  };
  
  const limpiarCarrito = () => {
    dispatch({ type: 'LIMPIAR_CARRITO' });
  };
  
  return (
    <CarritoContext.Provider value={{
      ...estado,
      agregarProducto,
      eliminarProducto,
      actualizarCantidad,
      limpiarCarrito
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