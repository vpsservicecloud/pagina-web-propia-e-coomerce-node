import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  // Conectar al servidor WebSocket
  conectar(): void {
    if (this.socket?.connected) {
      return;
    }

    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.configurarEventos();
  }

  // Configurar eventos del socket
  private configurarEventos(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor WebSocket');
      
      // Autenticar si hay token
      const token = localStorage.getItem('token');
      if (token) {
        this.autenticar(token);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error);
    });
  }

  // Autenticar usuario
  autenticar(token: string): void {
    this.token = token;
    if (this.socket?.connected) {
      this.socket.emit('autenticar', token);
    }
  }

  // Desconectar
  desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  // Unirse a sala de producto
  unirseAProducto(productoId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unirse_producto', productoId);
    }
  }

  // Salir de sala de producto
  salirDeProducto(productoId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('salir_producto', productoId);
    }
  }

  // Escuchar notificaciones
  escucharNotificaciones(callback: (notificacion: any) => void): void {
    if (this.socket) {
      this.socket.on('nueva_notificacion', callback);
      this.socket.on('notificaciones_pendientes', (notificaciones) => {
        notificaciones.forEach(callback);
      });
    }
  }

  // Obtener notificaciones
  obtenerNotificaciones(): void {
    if (this.socket?.connected) {
      this.socket.emit('obtener_notificaciones');
    }
  }

  // Escuchar lista de notificaciones
  escucharListaNotificaciones(callback: (notificaciones: any[]) => void): void {
    if (this.socket) {
      this.socket.on('notificaciones', callback);
    }
  }

  // Marcar notificación como leída
  marcarNotificacionLeida(notificacionId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('marcar_notificacion_leida', notificacionId);
    }
  }

  // Escuchar actualizaciones del carrito
  escucharActualizacionesCarrito(callback: (datos: any) => void): void {
    if (this.socket) {
      this.socket.on('carrito_actualizado', callback);
    }
  }

  // Notificar actualización del carrito
  notificarActualizacionCarrito(datos: any): void {
    if (this.socket?.connected) {
      this.socket.emit('actualizar_carrito', datos);
    }
  }

  // Escuchar actualizaciones de productos
  escucharActualizacionesProducto(callback: (datos: any) => void): void {
    if (this.socket) {
      this.socket.on('producto_actualizado', callback);
    }
  }

  // Verificar si está conectado
  estaConectado(): boolean {
    return this.socket?.connected || false;
  }

  // Obtener instancia del socket
  obtenerSocket(): Socket | null {
    return this.socket;
  }
}

// Crear instancia singleton
const webSocketService = new WebSocketService();

export default webSocketService;