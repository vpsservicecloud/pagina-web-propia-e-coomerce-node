import React from 'react';
import SeccionHero from '../components/SeccionHero';
import NavegacionCategorias from '../components/NavegacionCategorias';
import ProductosDestacados from '../components/ProductosDestacados';
import BannerPromo from '../components/BannerPromo';

const PaginaInicio: React.FC = () => {
  return (
    <main className="main-content">
      <SeccionHero />
      <NavegacionCategorias />
      <ProductosDestacados />
      <BannerPromo />
      
      <section className="features py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <span className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block">
                      <i className="bi bi-truck fs-4"></i>
                    </span>
                  </div>
                  <h4 className="mb-3">Envío Gratis</h4>
                  <p className="text-muted">En pedidos superiores a $50. Envío internacional disponible.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <span className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block">
                      <i className="bi bi-arrow-repeat fs-4"></i>
                    </span>
                  </div>
                  <h4 className="mb-3">Devoluciones Fáciles</h4>
                  <p className="text-muted">Política de devolución de 30 días para reembolso completo o cambio.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <span className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block">
                      <i className="bi bi-shield-check fs-4"></i>
                    </span>
                  </div>
                  <h4 className="mb-3">Pago Seguro</h4>
                  <p className="text-muted">Múltiples métodos de pago seguros para tu comodidad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaginaInicio;