import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../types';
import { authAPI } from '../services/api';
import webSocketService from '../services/websocket';

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
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken();
    }
  }, []);

  const verificarToken = async () => {
    try {
      setCargando(true);
      const respuesta = await authAPI.obtenerPerfil();
      if (respuesta.exito) {
        setUsuario(respuesta.datos);
        
        // Conectar WebSocket y autenticar
        webSocketService.conectar();
        webSocketService.autenticar(localStorage.getItem('token')!);
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      localStorage.removeItem('token');
    } finally {
      setCargando(false);
    }
  };
  
  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      const respuesta = await authAPI.iniciarSesion(email, password);
      
      if (respuesta.exito) {
        setUsuario(respuesta.datos.usuario);
        
        // Conectar WebSocket y autenticar
        webSocketService.conectar();
        webSocketService.autenticar(respuesta.datos.token);
        
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
      const respuesta = await authAPI.registrarse(datos);
      
      if (respuesta.exito) {
        setUsuario(respuesta.datos.usuario);
        
        // Conectar WebSocket y autenticar
        webSocketService.conectar();
        webSocketService.autenticar(respuesta.datos.token);
        
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
      await authAPI.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUsuario(null);
      webSocketService.desconectar();
    }
  };

  const actualizarPerfil = async (datos: any): Promise<boolean> => {
    try {
      setCargando(true);
      const respuesta = await authAPI.actualizarPerfil(datos);
      
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