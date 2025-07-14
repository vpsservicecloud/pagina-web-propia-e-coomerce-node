import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroProps> = ({
  title = "Premium Quality Products",
  subtitle = "Discover our exclusive collection of high-quality items at competitive prices",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  backgroundImage = "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1600"
}) => {
  return (
    <section 
      className="hero-section py-5" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="hero-content p-4 text-white fade-in">
              <h1 className="display-4 fw-bold mb-3">{title}</h1>
              <p className="lead mb-4">{subtitle}</p>
              <a href={ctaLink} className="btn btn-primary btn-lg rounded-pill px-4">
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;