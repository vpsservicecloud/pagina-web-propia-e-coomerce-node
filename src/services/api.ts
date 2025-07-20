// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3-1xzf8lu4--3001--96435430.local-credentialless.webcontainer-api.io/api';

// Función para obtener el token de autenticación
const obtenerToken = (): string | null => {
  return localStorage.getItem('token');
};

// Función para obtener el session ID
const obtenerSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Configuración base para fetch
const configuracionBase = (opciones: RequestInit = {}): RequestInit => {
  const token = obtenerToken();
  const sessionId = obtenerSessionId();
  
  return {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionId,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opciones.headers,
    },
  };
};

// Función genérica para hacer peticiones
const hacerPeticion = async <T>(endpoint: string, opciones: RequestInit = {}): Promise<T> => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, configuracionBase(opciones));
    
    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.mensaje || 'Error en la petición');
    }
    
    return await respuesta.json();
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
};

// Servicios de autenticación
export const authAPI = {
  async registrarse(datos: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
  }) {
    return hacerPeticion('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async iniciarSesion(email: string, password: string) {
    const respuesta = await hacerPeticion<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (respuesta.exito && respuesta.datos.token) {
      localStorage.setItem('token', respuesta.datos.token);
    }
    
    return respuesta;
  },

  async cerrarSesion() {
    const respuesta = await hacerPeticion('/auth/logout', {
      method: 'POST',
    });
    
    localStorage.removeItem('token');
    return respuesta;
  },

  async obtenerPerfil() {
    return hacerPeticion('/auth/perfil');
  },

  async actualizarPerfil(datos: {
    nombre: string;
    apellido: string;
    telefono?: string;
  }) {
    return hacerPeticion('/auth/perfil', {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
  },

  async cambiarPassword(passwordActual: string, passwordNueva: string) {
    return hacerPeticion('/auth/cambiar-password', {
      method: 'PUT',
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
  },
};

// Servicios de productos
export const productosAPI = {
  async obtenerProductos(filtros: {
    categoria?: string;
    busqueda?: string;
    precio_min?: number;
    precio_max?: number;
    ordenar?: string;
    direccion?: string;
    pagina?: number;
    limite?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        params.append(clave, valor.toString());
      }
    });
    
    return hacerPeticion(`/productos?${params.toString()}`);
  },

  async obtenerProductoPorId(id: string) {
    return hacerPeticion(`/productos/${id}`);
  },

  async obtenerProductosDestacados(limite: number = 8) {
    return hacerPeticion(`/productos/destacados?limite=${limite}`);
  },

  async obtenerProductosNuevos(limite: number = 8) {
    return hacerPeticion(`/productos/nuevos?limite=${limite}`);
  },

  async obtenerProductosRelacionados(id: string, limite: number = 4) {
    return hacerPeticion(`/productos/${id}/relacionados?limite=${limite}`);
  },

  async buscarProductos(termino: string) {
    return hacerPeticion(`/productos/buscar?q=${encodeURIComponent(termino)}`);
  },
};

// Servicios del carrito
export const carritoAPI = {
  async obtenerCarrito() {
    return hacerPeticion('/carrito');
  },

  async agregarProducto(producto_id: number, cantidad: number = 1) {
    return hacerPeticion('/carrito/agregar', {
      method: 'POST',
      body: JSON.stringify({ producto_id, cantidad }),
    });
  },

  async actualizarCantidad(item_id: number, cantidad: number) {
    return hacerPeticion('/carrito/actualizar', {
      method: 'PUT',
      body: JSON.stringify({ item_id, cantidad }),
    });
  },

  async eliminarProducto(item_id: number) {
    return hacerPeticion(`/carrito/item/${item_id}`, {
      method: 'DELETE',
    });
  },

  async limpiarCarrito() {
    return hacerPeticion('/carrito/limpiar', {
      method: 'DELETE',
    });
  },
};

// Función para verificar la salud del servidor
export const verificarSalud = async () => {
  return hacerPeticion('/health');
};