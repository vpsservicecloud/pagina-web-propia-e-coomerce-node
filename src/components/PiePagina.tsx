import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const PiePagina: React.FC = () => {
  const añoActual = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-5 bg-white">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-4">Acerca de Nosotros</h5>
            <p className="text-muted">
              Ofrecemos productos de alta calidad y excelente servicio al cliente para satisfacer todas tus necesidades.
            </p>
            <div className="fw-bold fs-4 text-primary mt-3">TiendaOnline</div>
          </div>
          
          <div className="col-md-2">
            <h5 className="fw-bold mb-4">Tienda</h5>
            <ul className="list-unstyled">
              <li><a href="/tienda" className="text-decoration-none text-muted">Todos los Productos</a></li>
              <li><a href="/categoria/ropa" className="text-decoration-none text-muted">Ropa</a></li>
              <li><a href="/categoria/calzado" className="text-decoration-none text-muted">Calzado</a></li>
              <li><a href="/categoria/accesorios" className="text-decoration-none text-muted">Accesorios</a></li>
            </ul>
          </div>
          
          <div className="col-md-2">
            <h5 className="fw-bold mb-4">Cliente</h5>
            <ul className="list-unstyled">
              <li><a href="/cuenta" className="text-decoration-none text-muted">Mi Cuenta</a></li>
              <li><a href="/pedidos" className="text-decoration-none text-muted">Pedidos</a></li>
              <li><a href="/favoritos" className="text-decoration-none text-muted">Favoritos</a></li>
              <li><a href="/ayuda" className="text-decoration-none text-muted">Ayuda</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="fw-bold mb-4">Mantente Conectado</h5>
            <p className="text-muted">Suscríbete a nuestro boletín para recibir actualizaciones y promociones.</p>
            <form>
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Tu email" 
                  aria-label="Email" 
                />
                <button className="btn btn-primary" type="submit">Suscribirse</button>
              </div>
            </form>
            <div className="social-links mt-3">
              <a href="#" className="text-decoration-none text-muted me-3" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted me-3" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted me-3" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted" aria-label="Youtube">
                <Youtube size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="small text-muted mb-md-0">
              © {añoActual} TiendaOnline. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline text-md-end mb-0">
              <li className="list-inline-item">
                <a href="/terminos" className="text-decoration-none small text-muted">
                  Términos y Condiciones
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="/privacidad" className="text-decoration-none small text-muted">
                  Política de Privacidad
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="/cookies" className="text-decoration-none small text-muted">
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;