import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useNavegacion } from '../hooks/useNavegacion';

const PaginaIniciarSesion: React.FC = () => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  
  const [datosFormulario, setDatosFormulario] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    confirmarPassword: ''
  });

  const { iniciarSesion, registrarse } = useAutenticacion();
  const { navegarA } = useNavegacion();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (esRegistro) {
        if (datosFormulario.password !== datosFormulario.confirmarPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        
        const exito = await registrarse(datosFormulario);
        if (exito) {
          navegarA('/cuenta');
        } else {
          setError('Error al registrar la cuenta');
        }
      } else {
        const exito = await iniciarSesion(datosFormulario.email, datosFormulario.password);
        if (exito) {
          // Verificar si hay una redirección pendiente
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect');
          navegarA(redirect || '/cuenta');
        } else {
          setError('Email o contraseña incorrectos');
        }
      }
    } catch (err) {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <User size={24} className="text-primary" />
                  </div>
                  <h2 className="mb-2">
                    {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
                  </h2>
                  <p className="text-muted">
                    {esRegistro 
                      ? 'Únete a nuestra comunidad' 
                      : 'Accede a tu cuenta para continuar'
                    }
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={manejarEnvio}>
                  {esRegistro && (
                    <>
                      <div className="row mb-3">
                        <div className="col-6">
                          <label htmlFor="nombre" className="form-label">Nombre</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            name="nombre"
                            value={datosFormulario.nombre}
                            onChange={manejarCambio}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="apellido" className="form-label">Apellido</label>
                          <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            name="apellido"
                            value={datosFormulario.apellido}
                            onChange={manejarCambio}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={datosFormulario.email}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  {esRegistro && (
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={datosFormulario.telefono}
                        onChange={manejarCambio}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-group">
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        value={datosFormulario.password}
                        onChange={manejarCambio}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                      >
                        {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {esRegistro && (
                    <div className="mb-3">
                      <label htmlFor="confirmarPassword" className="form-label">Confirmar Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmarPassword"
                        name="confirmarPassword"
                        value={datosFormulario.confirmarPassword}
                        onChange={manejarCambio}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {esRegistro ? 'Creando cuenta...' : 'Iniciando sesión...'}
                      </>
                    ) : (
                      esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        setEsRegistro(!esRegistro);
                        setError('');
                        setDatosFormulario({
                          email: '',
                          password: '',
                          nombre: '',
                          apellido: '',
                          telefono: '',
                          confirmarPassword: ''
                        });
                      }}
                    >
                      {esRegistro 
                        ? '¿Ya tienes cuenta? Inicia sesión' 
                        : '¿No tienes cuenta? Regístrate'
                      }
                    </button>
                  </div>
                </form>

                {!esRegistro && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>Cuenta de prueba:</strong><br />
                      Email: juan@ejemplo.com<br />
                      Contraseña: 123456
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaIniciarSesion;