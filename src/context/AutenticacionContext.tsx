import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../types';

interface ContextoAutenticacion {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  registrarse: (datos: any) => Promise<boolean>;
  cerrarSesion: () => void;
}

const AutenticacionContext = createContext<ContextoAutenticacion | undefined>(undefined);

// Usuario de ejemplo para demostración
const usuarioEjemplo: Usuario = {
  id: '1',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+1 (555) 123-4567',
  direcciones: [
    {
      id: '1',
      nombre: 'Casa',
      direccion: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      pais: 'España',
      telefono: '+34 123 456 789',
      esPredeterminada: true
    }
  ]
};

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    // Simulación de autenticación
    if (email === 'juan@ejemplo.com' && password === '123456') {
      setUsuario(usuarioEjemplo);
      return true;
    }
    return false;
  };
  
  const registrarse = async (datos: any): Promise<boolean> => {
    // Simulación de registro
    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      telefono: datos.telefono,
      direcciones: []
    };
    setUsuario(nuevoUsuario);
    return true;
  };
  
  const cerrarSesion = () => {
    setUsuario(null);
  };
  
  return (
    <AutenticacionContext.Provider value={{
      usuario,
      estaAutenticado: !!usuario,
      iniciarSesion,
      registrarse,
      cerrarSesion
    }}>
      {children}
    </AutenticacionContext.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(AutenticacionContext);
  if (contexto === undefined) {
    throw new Error('useAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
}