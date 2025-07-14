import React from 'react';
import ProductCard from './ProductCard';

// Sample product data
const products = [
  {
    id: '1',
    name: 'Premium T-Shirt',
    price: 29.99,
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    discount: 10,
    isNew: true
  },
  {
    id: '2',
    name: 'Classic Jeans',
    price: 59.99,
    image: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNew: true
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 89.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    discount: 15
  },
  {
    id: '4',
    name: 'Minimalist Watch',
    price: 120,
    image: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const FeaturedProducts: React.FC = () => {
  return (
    <section className="featured-products py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold mb-2">Featured Products</h2>
            <p className="text-muted">Discover our carefully selected products</p>
          </div>
        </div>
        
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-6 col-md-3">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        
        <div className="row mt-5">
          <div className="col-12 text-center">
            <a href="/shop" className="btn btn-outline-primary rounded-pill px-4">
              View All Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;