import { Categoria } from '../types';
import { productosAPI } from '../services/api';

export const categorias: Categoria[] = [
  { id: '1', nombre: 'Ropa', url: '/categoria/ropa' },
  { id: '2', nombre: 'Calzado', url: '/categoria/calzado' },
  { id: '3', nombre: 'Accesorios', url: '/categoria/accesorios' },
  { id: '4', nombre: 'Electrónicos', url: '/categoria/electronicos' },
  { id: '5', nombre: 'Hogar', url: '/categoria/hogar' },
  { id: '6', nombre: 'Belleza', url: '/categoria/belleza' }
];

// Funciones para obtener productos desde la API
export async function obtenerProductoPorId(id: string) {
  try {
    const respuesta = await productosAPI.obtenerProductoPorId(id);
    return respuesta.exito ? respuesta.datos : null;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return null;
  }
}

export async function obtenerProductosPorCategoria(categoria: string) {
  try {
    const respuesta = await productosAPI.obtenerProductos({ categoria });
    return respuesta.exito ? respuesta.datos.productos : [];
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return [];
  }
}

export async function buscarProductos(termino: string) {
  try {
    const respuesta = await productosAPI.buscarProductos(termino);
    return respuesta.exito ? respuesta.datos.productos : [];
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return [];
  }
}

export async function obtenerProductosDestacados(limite: number = 8) {
  try {
    const respuesta = await productosAPI.obtenerProductosDestacados(limite);
    return respuesta.exito ? respuesta.datos : [];
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    return [];
  }
}