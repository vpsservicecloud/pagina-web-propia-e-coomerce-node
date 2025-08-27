import { supabase } from '../lib/supabase'
import { Producto } from '../types'

// Función para obtener el session ID del navegador
const obtenerSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

// Servicios de autenticación
export const authService = {
  async registrarse(datos: {
    nombre: string
    apellido: string
    email: string
    password: string
    telefono?: string
  }) {
    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: datos.email,
        password: datos.password,
      })

      if (authError) throw authError

      // Crear perfil del usuario
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('perfiles')
          .insert({
            id: authData.user.id,
            nombre: datos.nombre,
            apellido: datos.apellido,
            telefono: datos.telefono
          })

        if (profileError) throw profileError
      }

      return { exito: true, datos: authData }
    } catch (error) {
      console.error('Error al registrarse:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async iniciarSesion(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { exito: true, datos: data }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async cerrarSesion() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { exito: true }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async obtenerPerfil() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuario no autenticado')

      const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return { 
        exito: true, 
        datos: { 
          ...perfil, 
          email: user.email,
          direcciones: [] // Por simplicidad, dejamos vacío por ahora
        } 
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async actualizarPerfil(datos: {
    nombre: string
    apellido: string
    telefono?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('perfiles')
        .update(datos)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      return { exito: true, datos: data }
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      return { exito: false, mensaje: error.message }
    }
  }
}

// Servicios de productos
export const productosService = {
  async obtenerProductos(filtros: {
    categoria?: string
    busqueda?: string
    precio_min?: number
    precio_max?: number
    ordenar?: string
    direccion?: string
    pagina?: number
    limite?: number
  } = {}) {
    try {
      let query = supabase
        .from('productos')
        .select('*')
        .eq('activo', true)

      // Aplicar filtros
      if (filtros.categoria && filtros.categoria !== 'todas') {
        query = query.eq('categoria', filtros.categoria)
      }

      if (filtros.busqueda) {
        query = query.or(`nombre.ilike.%${filtros.busqueda}%,descripcion.ilike.%${filtros.busqueda}%`)
      }

      if (filtros.precio_min) {
        query = query.gte('precio', filtros.precio_min)
      }

      if (filtros.precio_max) {
        query = query.lte('precio', filtros.precio_max)
      }

      // Ordenamiento
      if (filtros.ordenar) {
        const ascending = filtros.direccion === 'asc'
        query = query.order(filtros.ordenar, { ascending })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Paginación
      const limite = filtros.limite || 12
      const pagina = filtros.pagina || 1
      const desde = (pagina - 1) * limite
      const hasta = desde + limite - 1

      query = query.range(desde, hasta)

      const { data, error, count } = await query

      if (error) throw error

      return {
        exito: true,
        datos: {
          productos: data || [],
          paginacion: {
            pagina_actual: pagina,
            total_paginas: Math.ceil((count || 0) / limite),
            total_productos: count || 0,
            productos_por_pagina: limite
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener productos:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async obtenerProductoPorId(id: string) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .eq('activo', true)
        .single()

      if (error) throw error

      return { exito: true, datos: data }
    } catch (error) {
      console.error('Error al obtener producto:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async obtenerProductosDestacados(limite: number = 8) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .eq('destacado', true)
        .order('created_at', { ascending: false })
        .limit(limite)

      if (error) throw error

      return { exito: true, datos: data || [] }
    } catch (error) {
      console.error('Error al obtener productos destacados:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async obtenerProductosNuevos(limite: number = 8) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .eq('nuevo', true)
        .order('created_at', { ascending: false })
        .limit(limite)

      if (error) throw error

      return { exito: true, datos: data || [] }
    } catch (error) {
      console.error('Error al obtener productos nuevos:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async buscarProductos(termino: string) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .or(`nombre.ilike.%${termino}%,descripcion.ilike.%${termino}%`)
        .order('nombre')
        .limit(50)

      if (error) throw error

      return {
        exito: true,
        datos: {
          productos: data || [],
          termino_busqueda: termino,
          total_resultados: data?.length || 0
        }
      }
    } catch (error) {
      console.error('Error al buscar productos:', error)
      return { exito: false, mensaje: error.message }
    }
  }
}

// Servicios del carrito
export const carritoService = {
  async obtenerCarrito() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const sessionId = obtenerSessionId()

      let query = supabase
        .from('carrito_items')
        .select(`
          *,
          productos (
            id,
            nombre,
            precio,
            precio_oferta,
            imagen,
            stock
          )
        `)

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        query = query.eq('session_id', sessionId)
      }

      const { data, error } = await query

      if (error) throw error

      const items = data || []
      const subtotal = items.reduce((total, item) => {
        const precio = item.productos.precio_oferta || item.productos.precio
        return total + (precio * item.cantidad)
      }, 0)

      const impuestos = subtotal * 0.1
      const envio = subtotal >= 50 ? 0 : 5.99
      const total = subtotal + impuestos + envio

      return {
        exito: true,
        datos: {
          items,
          resumen: {
            subtotal: parseFloat(subtotal.toFixed(2)),
            impuestos: parseFloat(impuestos.toFixed(2)),
            envio: parseFloat(envio.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            cantidad_items: items.reduce((total, item) => total + item.cantidad, 0)
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener carrito:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async agregarProducto(producto_id: string, cantidad: number = 1) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const sessionId = obtenerSessionId()

      // Verificar si el producto ya está en el carrito
      let queryExistente = supabase
        .from('carrito_items')
        .select('*')
        .eq('producto_id', producto_id)

      if (user) {
        queryExistente = queryExistente.eq('user_id', user.id)
      } else {
        queryExistente = queryExistente.eq('session_id', sessionId)
      }

      const { data: itemExistente } = await queryExistente.single()

      if (itemExistente) {
        // Actualizar cantidad
        const { error } = await supabase
          .from('carrito_items')
          .update({ cantidad: itemExistente.cantidad + cantidad })
          .eq('id', itemExistente.id)

        if (error) throw error
      } else {
        // Agregar nuevo item
        const { error } = await supabase
          .from('carrito_items')
          .insert({
            user_id: user?.id,
            session_id: user ? null : sessionId,
            producto_id,
            cantidad
          })

        if (error) throw error
      }

      return { exito: true, mensaje: 'Producto agregado al carrito' }
    } catch (error) {
      console.error('Error al agregar producto:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async actualizarCantidad(item_id: string, cantidad: number) {
    try {
      const { error } = await supabase
        .from('carrito_items')
        .update({ cantidad })
        .eq('id', item_id)

      if (error) throw error

      return { exito: true, mensaje: 'Cantidad actualizada' }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async eliminarProducto(item_id: string) {
    try {
      const { error } = await supabase
        .from('carrito_items')
        .delete()
        .eq('id', item_id)

      if (error) throw error

      return { exito: true, mensaje: 'Producto eliminado del carrito' }
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      return { exito: false, mensaje: error.message }
    }
  },

  async limpiarCarrito() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const sessionId = obtenerSessionId()

      let query = supabase.from('carrito_items').delete()

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        query = query.eq('session_id', sessionId)
      }

      const { error } = await query

      if (error) throw error

      return { exito: true, mensaje: 'Carrito limpiado' }
    } catch (error) {
      console.error('Error al limpiar carrito:', error)
      return { exito: false, mensaje: error.message }
    }
  }
}