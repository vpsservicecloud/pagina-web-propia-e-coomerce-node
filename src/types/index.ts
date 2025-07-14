// Tipos para el sistema de e-commerce
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  descuento?: number;
  esNuevo?: boolean;
  stock: number;
  imagenes?: string[];
  especificaciones?: { [key: string]: string };
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direcciones: Direccion[];
}

export interface Direccion {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  telefono: string;
  esPredeterminada: boolean;
}

export interface Pedido {
  id: string;
  fecha: string;
  estado: 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  items: ItemCarrito[];
  direccionEnvio: Direccion;
}

export interface Categoria {
  id: string;
  nombre: string;
  url: string;
  imagen?: string;
}