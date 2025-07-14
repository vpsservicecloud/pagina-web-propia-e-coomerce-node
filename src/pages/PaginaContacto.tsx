import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const PaginaContacto: React.FC = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setEnviado(true);
    setEnviando(false);
    setFormulario({ nombre: '', email: '', asunto: '', mensaje: '' });
    
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="mb-3">Contáctanos</h1>
            <p className="text-muted lead">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
            </p>
          </div>
        </div>

        <div className="row g-5">
          {/* Información de contacto */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body p-4">
                <h4 className="mb-4">Información de Contacto</h4>
                
                <div className="contact-info">
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1">Dirección</h6>
                      <p className="text-muted mb-0">
                        Calle Principal 123<br />
                        Madrid, España 28001
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1">Teléfono</h6>
                      <p className="text-muted mb-0">
                        +34 123 456 789<br />
                        +34 987 654 321
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1">Email</h6>
                      <p className="text-muted mb-0">
                        info@tiendaonline.com<br />
                        soporte@tiendaonline.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1">Horario de Atención</h6>
                      <p className="text-muted mb-0">
                        Lunes - Viernes: 9:00 - 18:00<br />
                        Sábado: 10:00 - 14:00<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body p-4">
                <h4 className="mb-4">Envíanos un Mensaje</h4>
                
                {enviado && (
                  <div className="alert alert-success" role="alert">
                    <strong>¡Mensaje enviado!</strong> Te responderemos pronto.
                  </div>
                )}
                
                <form onSubmit={manejarEnvio}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formulario.email}
                        onChange={manejarCambio}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="asunto" className="form-label">Asunto *</label>
                    <select
                      className="form-select"
                      id="asunto"
                      name="asunto"
                      value={formulario.asunto}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta-general">Consulta General</option>
                      <option value="soporte-tecnico">Soporte Técnico</option>
                      <option value="pedidos">Consulta sobre Pedidos</option>
                      <option value="devoluciones">Devoluciones y Cambios</option>
                      <option value="sugerencias">Sugerencias</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="mensaje" className="form-label">Mensaje *</label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      name="mensaje"
                      rows={6}
                      value={formulario.mensaje}
                      onChange={manejarCambio}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={enviando}
                  >
                    {enviando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="me-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-4">
                <h4 className="mb-4">Preguntas Frecuentes</h4>
                
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq1"
                      >
                        ¿Cuáles son los métodos de pago disponibles?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y pago contra entrega en algunas zonas.
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq2"
                      >
                        ¿Cuánto tiempo tarda el envío?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Los envíos estándar tardan entre 2-3 días hábiles. Ofrecemos envío express en 24 horas para pedidos realizados antes de las 14:00h.
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq3"
                      >
                        ¿Puedo devolver un producto?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Sí, tienes 30 días desde la recepción del producto para devolverlo. El producto debe estar en perfectas condiciones y con su embalaje original.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaContacto;