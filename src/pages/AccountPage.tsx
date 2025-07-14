import React, { useState } from 'react';

// Sample order data
const orders = [
  { id: '12345', date: '2025-04-15', status: 'Delivered', total: '$125.99' },
  { id: '12346', date: '2025-04-10', status: 'Processing', total: '$79.50' },
  { id: '12347', date: '2025-03-28', status: 'Delivered', total: '$214.75' }
];

// Sample favorite products
const favorites = [
  { id: '1', name: 'Premium T-Shirt', price: '$29.99', image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg' },
  { id: '2', name: 'Classic Jeans', price: '$59.99', image: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg' }
];

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <main className="main-content py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="bg-light rounded-circle mx-auto mb-3" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-person fs-1 text-primary"></i>
                  </div>
                  <h5 className="mb-0">John Doe</h5>
                  <p className="text-muted small">john.doe@example.com</p>
                </div>
                
                <ul className="nav flex-column account-tabs">
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                      href="#profile"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('profile');
                      }}
                    >
                      <i className="bi bi-person me-2"></i> Profile
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                      href="#orders"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('orders');
                      }}
                    >
                      <i className="bi bi-box me-2"></i> Orders
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                      href="#favorites"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('favorites');
                      }}
                    >
                      <i className="bi bi-heart me-2"></i> Favorites
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                      href="#addresses"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('addresses');
                      }}
                    >
                      <i className="bi bi-geo-alt me-2"></i> Addresses
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                      href="#settings"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('settings');
                      }}
                    >
                      <i className="bi bi-gear me-2"></i> Settings
                    </a>
                  </li>
                </ul>
                
                <hr className="my-3" />
                
                <a href="/logout" className="btn btn-outline-danger w-100">
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-9">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {activeTab === 'profile' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">My Profile</h3>
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="firstName" className="form-label">First Name</label>
                          <input type="text" className="form-control" id="firstName" defaultValue="John" />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">Last Name</label>
                          <input type="text" className="form-control" id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="tel" className="form-control" id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="d-grid d-md-flex justify-content-md-end">
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'orders' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">My Orders</h3>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.date}</td>
                              <td>
                                <span className={`badge bg-${order.status === 'Delivered' ? 'success' : 'warning'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>{order.total}</td>
                              <td>
                                <a href={`/order/${order.id}`} className="btn btn-sm btn-outline-primary">
                                  View
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === 'favorites' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">My Favorites</h3>
                    <div className="row g-4">
                      {favorites.map(product => (
                        <div key={product.id} className="col-md-6">
                          <div className="card product-card">
                            <div className="row g-0">
                              <div className="col-4">
                                <img src={product.image} className="img-fluid rounded-start" alt={product.name} style={{ height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div className="col-8">
                                <div className="card-body">
                                  <h5 className="card-title">{product.name}</h5>
                                  <p className="card-text product-price">{product.price}</p>
                                  <div className="d-flex gap-2">
                                    <a href={`/product/${product.id}`} className="btn btn-sm btn-primary">
                                      View
                                    </a>
                                    <button className="btn btn-sm btn-outline-danger">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'addresses' && (
                  <div className="tab-content fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">My Addresses</h3>
                      <button className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i> Add New
                      </button>
                    </div>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Home <span className="badge bg-primary ms-2">Default</span></h5>
                            <address className="mb-3">
                              John Doe<br />
                              123 Main Street<br />
                              Apt 4B<br />
                              New York, NY 10001<br />
                              United States<br />
                              <strong>Phone:</strong> +1 (555) 123-4567
                            </address>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary">Edit</button>
                              <button className="btn btn-sm btn-outline-danger">Remove</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Office</h5>
                            <address className="mb-3">
                              John Doe<br />
                              456 Business Ave<br />
                              Suite 100<br />
                              San Francisco, CA 94107<br />
                              United States<br />
                              <strong>Phone:</strong> +1 (555) 987-6543
                            </address>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary">Edit</button>
                              <button className="btn btn-sm btn-outline-danger">Remove</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="tab-content fade-in">
                    <h3 className="mb-4">Account Settings</h3>
                    
                    <div className="mb-4">
                      <h5>Change Password</h5>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="currentPassword" className="form-label">Current Password</label>
                          <input type="password" className="form-control" id="currentPassword" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">New Password</label>
                          <input type="password" className="form-control" id="newPassword" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                          <input type="password" className="form-control" id="confirmPassword" />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>
                      </form>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="mb-4">
                      <h5>Notification Preferences</h5>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Email Notifications
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="smsNotifications" />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          SMS Notifications
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="marketingEmails" defaultChecked />
                        <label className="form-check-label" htmlFor="marketingEmails">
                          Marketing Emails
                        </label>
                      </div>
                      <button className="btn btn-primary">Save Preferences</button>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div>
                      <h5 className="text-danger">Delete Account</h5>
                      <p className="text-muted">This action cannot be undone. All your data will be permanently deleted.</p>
                      <button className="btn btn-outline-danger">Delete Account</button>
                    </div>
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

export default AccountPage;