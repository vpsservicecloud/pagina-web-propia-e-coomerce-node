import React from 'react';

// Sample categories
const categories = [
  { id: '1', name: 'Clothing', url: '/category/clothing' },
  { id: '2', name: 'Footwear', url: '/category/footwear' },
  { id: '3', name: 'Accessories', url: '/category/accessories' },
  { id: '4', name: 'Electronics', url: '/category/electronics' },
  { id: '5', name: 'Home & Living', url: '/category/home-living' },
  { id: '6', name: 'Beauty', url: '/category/beauty' }
];

const CategoryNavigation: React.FC = () => {
  return (
    <nav className="category-nav py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center flex-wrap">
              {categories.map(category => (
                <a 
                  key={category.id} 
                  href={category.url} 
                  className="btn btn-outline-secondary rounded-pill m-1"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavigation;