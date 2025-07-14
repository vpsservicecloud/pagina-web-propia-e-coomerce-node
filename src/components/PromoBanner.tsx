import React from 'react';

interface PromoBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  backgroundColor?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title = "Summer Sale",
  description = "Up to 50% off on selected items. Limited time offer!",
  ctaText = "Shop the Sale",
  ctaLink = "/sale",
  imageUrl = "https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  backgroundColor = "#f8f4eb"
}) => {
  return (
    <section className="promo-banner py-5\" style={{ backgroundColor }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <img 
              src={imageUrl} 
              alt={title} 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
            />
          </div>
          <div className="col-md-6 order-md-1 py-4">
            <div className="p-md-4">
              <h2 className="display-5 fw-bold mb-3">{title}</h2>
              <p className="lead mb-4">{description}</p>
              <a href={ctaLink} className="btn btn-primary rounded-pill px-4">
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;