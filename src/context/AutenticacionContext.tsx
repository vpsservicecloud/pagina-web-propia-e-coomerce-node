import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../types';
import { authService } from '../services/supabase';
import { supabase } from '../lib/supabase';

interface ContextoAutenticacion {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  registrarse: (datos: any) => Promise<boolean>;
  cerrarSesion: () => void;
  actualizarPerfil: (datos: any) => Promise<boolean>;
}

const AutenticacionContext = createContext<ContextoAutenticacion | undefined>(undefined);


export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(false);

  // Verificar si hay token al cargar
  React.useEffect(() => {
    verificarSesion();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await cargarPerfil();
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const verificarSesion = async () => {
    try {
      setCargando(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await cargarPerfil();
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarPerfil = async () => {
    try {
      const respuesta = await authService.obtenerPerfil();
      if (respuesta.exito) {
        setUsuario(respuesta.datos);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };
  
  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      const respuesta = await authService.iniciarSesion(email, password);
      
      if (respuesta.exito) {
        await cargarPerfil();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };
  
  const registrarse = async (datos: any): Promise<boolean> => {
    try {
      setCargando(true);
      const respuesta = await authService.registrarse(datos);
      
      if (respuesta.exito) {
        await cargarPerfil();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al registrarse:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };
  
  const cerrarSesion = async () => {
    try {
      await authService.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUsuario(null);
    }
  };

  const actualizarPerfil = async (datos: any): Promise<boolean> => {
    try {
      setCargando(true);
      const respuesta = await authService.actualizarPerfil(datos);
      
      if (respuesta.exito) {
        setUsuario(respuesta.datos);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };
  
  return (
    <AutenticacionContext.Provider value={{
      usuario,
      estaAutenticado: !!usuario,
      cargando,
      iniciarSesion,
      registrarse,
      cerrarSesion,
      actualizarPerfil
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