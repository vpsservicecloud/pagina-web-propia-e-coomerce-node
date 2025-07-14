import { Producto, Categoria } from '../types';

export const categorias: Categoria[] = [
  { id: '1', nombre: 'Ropa', url: '/categoria/ropa' },
  { id: '2', nombre: 'Calzado', url: '/categoria/calzado' },
  { id: '3', nombre: 'Accesorios', url: '/categoria/accesorios' },
  { id: '4', nombre: 'Electrónicos', url: '/categoria/electronicos' },
  { id: '5', nombre: 'Hogar', url: '/categoria/hogar' },
  { id: '6', nombre: 'Belleza', url: '/categoria/belleza' }
];

export const productos: Producto[] = [
  {
    id: '1',
    nombre: 'Camiseta Premium',
    precio: 29.99,
    imagen: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Camiseta de algodón 100% premium con corte moderno y acabados de alta calidad.',
    categoria: 'ropa',
    descuento: 10,
    esNuevo: true,
    stock: 50,
    imagenes: [
      'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Material': '100% Algodón',
      'Talla': 'S, M, L, XL',
      'Color': 'Blanco, Negro, Azul',
      'Cuidado': 'Lavado a máquina 30°C'
    }
  },
  {
    id: '2',
    nombre: 'Jeans Clásicos',
    precio: 59.99,
    imagen: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Jeans de corte clásico con denim de alta calidad y ajuste perfecto.',
    categoria: 'ropa',
    esNuevo: true,
    stock: 30,
    imagenes: [
      'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Material': '98% Algodón, 2% Elastano',
      'Talla': '28, 30, 32, 34, 36',
      'Color': 'Azul oscuro, Azul claro',
      'Corte': 'Regular fit'
    }
  },
  {
    id: '3',
    nombre: 'Zapatillas Deportivas',
    precio: 89.99,
    imagen: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Zapatillas deportivas con tecnología de amortiguación avanzada para máximo confort.',
    categoria: 'calzado',
    descuento: 15,
    stock: 25,
    imagenes: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Material': 'Sintético y malla transpirable',
      'Talla': '38, 39, 40, 41, 42, 43, 44',
      'Color': 'Blanco, Negro, Gris',
      'Suela': 'Goma antideslizante'
    }
  },
  {
    id: '4',
    nombre: 'Reloj Minimalista',
    precio: 120,
    imagen: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Reloj de diseño minimalista con correa de cuero genuino y movimiento de cuarzo.',
    categoria: 'accesorios',
    stock: 15,
    imagenes: [
      'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Movimiento': 'Cuarzo japonés',
      'Correa': 'Cuero genuino',
      'Resistencia': 'Resistente al agua 3ATM',
      'Garantía': '2 años'
    }
  },
  {
    id: '5',
    nombre: 'Auriculares Inalámbricos',
    precio: 149.99,
    imagen: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Auriculares inalámbricos con cancelación de ruido y batería de larga duración.',
    categoria: 'electronicos',
    esNuevo: true,
    stock: 20,
    imagenes: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Conectividad': 'Bluetooth 5.0',
      'Batería': 'Hasta 30 horas',
      'Cancelación de ruido': 'Activa',
      'Micrófono': 'Integrado'
    }
  },
  {
    id: '6',
    nombre: 'Mochila Urbana',
    precio: 79.99,
    imagen: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    descripcion: 'Mochila urbana resistente al agua con compartimento para laptop y múltiples bolsillos.',
    categoria: 'accesorios',
    stock: 35,
    imagenes: [
      'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    especificaciones: {
      'Material': 'Nylon resistente al agua',
      'Capacidad': '25 litros',
      'Compartimentos': 'Laptop hasta 15.6"',
      'Color': 'Negro, Gris, Azul marino'
    }
  }
];

export function obtenerProductoPorId(id: string): Producto | undefined {
  return productos.find(producto => producto.id === id);
}

export function obtenerProductosPorCategoria(categoria: string): Producto[] {
  return productos.filter(producto => producto.categoria === categoria);
}

export function buscarProductos(termino: string): Producto[] {
  const terminoLower = termino.toLowerCase();
  return productos.filter(producto => 
    producto.nombre.toLowerCase().includes(terminoLower) ||
    producto.descripcion.toLowerCase().includes(terminoLower) ||
    producto.categoria.toLowerCase().includes(terminoLower)
  );
}