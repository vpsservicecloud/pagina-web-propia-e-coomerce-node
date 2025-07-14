import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductProps {
  id: string;
  name: string;
  price: string | number;
  image: string;
  discount?: string | number;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  name,
  price,
  image,
  discount,
  isNew = false
}) => {
  return (
    <div className="product-card card h-100">
      <div className="position-relative">
        <img
          src={image}
          className="card-img-top"
          alt={name}
        />
        
        {/* Product badges */}
        <div className="position-absolute top-0 start-0 p-2">
          {isNew && (
            <span className="badge bg-info me-2">New</span>
          )}
          {discount && (
            <span className="badge bg-danger">-{discount}%</span>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="position-absolute top-0 end-0 p-2">
          <button 
            className="btn btn-sm btn-light rounded-circle shadow-sm me-1"
            title="Add to wishlist"
          >
            <Heart size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      <div className="card-body p-3">
        <h5 className="card-title mb-1">
          <a href={`/product/${id}`} className="text-decoration-none text-dark stretched-link">
            {name}
          </a>
        </h5>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="product-price">
            {discount ? (
              <>
                <span className="text-danger">${typeof price === 'number' ? price.toFixed(2) : price}</span>
                <small className="text-muted text-decoration-line-through ms-2">
                  ${typeof price === 'number' 
                    ? ((price / (1 - Number(discount) / 100)).toFixed(2)) 
                    : price}
                </small>
              </>
            ) : (
              <span>${typeof price === 'number' ? price.toFixed(2) : price}</span>
            )}
          </div>
          
          <button className="btn btn-sm btn-primary rounded-pill">
            <ShoppingCart size={16} className="me-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;