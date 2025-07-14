import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryNavigation from '../components/CategoryNavigation';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanner from '../components/PromoBanner';

const HomePage: React.FC = () => {
  return (
    <main className="main-content">
      <HeroSection />
      <CategoryNavigation />
      <FeaturedProducts />
      <PromoBanner />
      
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
                  <h4 className="mb-3">Free Shipping</h4>
                  <p className="text-muted">On all orders over $50. International shipping available.</p>
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
                  <h4 className="mb-3">Easy Returns</h4>
                  <p className="text-muted">30-day return policy for a full refund or exchange.</p>
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
                  <h4 className="mb-3">Secure Payment</h4>
                  <p className="text-muted">Multiple secure payment methods for your convenience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;