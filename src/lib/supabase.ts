import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          precio: number
          precio_oferta?: number
          categoria: string
          stock: number
          imagen: string
          imagenes?: string[]
          especificaciones?: Record<string, string>
          destacado: boolean
          nuevo: boolean
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          precio: number
          precio_oferta?: number
          categoria: string
          stock: number
          imagen: string
          imagenes?: string[]
          especificaciones?: Record<string, string>
          destacado?: boolean
          nuevo?: boolean
          activo?: boolean
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string
          precio?: number
          precio_oferta?: number
          categoria?: string
          stock?: number
          imagen?: string
          imagenes?: string[]
          especificaciones?: Record<string, string>
          destacado?: boolean
          nuevo?: boolean
          activo?: boolean
        }
      }
      carrito_items: {
        Row: {
          id: string
          user_id?: string
          session_id?: string
          producto_id: string
          cantidad: number
          created_at: string
          productos: {
            id: string
            nombre: string
            precio: number
            imagen: string
            stock: number
          }
        }
        Insert: {
          id?: string
          user_id?: string
          session_id?: string
          producto_id: string
          cantidad: number
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          producto_id?: string
          cantidad?: number
        }
      }
      perfiles: {
        Row: {
          id: string
          nombre: string
          apellido: string
          telefono?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nombre: string
          apellido: string
          telefono?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          telefono?: string
        }
      }
    }
  }
}