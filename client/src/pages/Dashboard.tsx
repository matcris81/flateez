import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const user = useAuthStore(state => state.user);
  const [properties, setProperties] = useState<any[]>([]);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (user?.userType === 'landlord') {
        const { data } = await api.get('/properties');
        const myProperties = data.filter((p: any) => p.landlordId._id === user.id);
        setProperties(myProperties);
      } else if (user?.userType === 'renter') {
        const { data } = await api.get('/saved');
        setSavedProperties(data);
      }
      
      const { data: messagesData } = await api.get('/messages');
      setMessages(messagesData.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.firstName}!</h1>
          <p className="user-type-badge">
            {user?.userType === 'landlord' ? '🏠 Landlord' : '🔍 Renter'}
          </p>
        </div>
        {user?.userType === 'landlord' && (
          <button className="btn-primary">+ Add New Property</button>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          {user?.userType === 'landlord' ? (
            <>
              <div className="section-header">
                <h2>Your Properties</h2>
                <span className="count-badge">{properties.length}</span>
              </div>
              {properties.length > 0 ? (
                <div className="property-list">
                  {properties.map(property => (
                    <Link 
                      key={property._id} 
                      to={`/properties/${property._id}`}
                      className="property-item"
                    >
                      <div className="property-item-info">
                        <h3>{property.title}</h3>
                        <p className="property-location">
                          {property.address.city}, {property.address.state}
                        </p>
                        <p className="property-details">
                          {property.bedrooms} bed • {property.bathrooms} bath
                        </p>
                      </div>
                      <div className="property-item-price">
                        <span className="price">${property.price}</span>
                        <span className="period">/month</span>
                        <span className={`status ${property.available ? 'available' : 'unavailable'}`}>
                          {property.available ? 'Available' : 'Rented'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't listed any properties yet</p>
                  <button className="btn-primary">Create Your First Listing</button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="section-header">
                <h2>Saved Properties</h2>
                <span className="count-badge">{savedProperties.length}</span>
              </div>
              {savedProperties.length > 0 ? (
                <div className="property-list">
                  {savedProperties.map(property => (
                    <Link 
                      key={property._id} 
                      to={`/properties/${property._id}`}
                      className="property-item"
                    >
                      <div className="property-item-info">
                        <h3>{property.title}</h3>
                        <p className="property-location">
                          {property.address.city}, {property.address.state}
                        </p>
                        <p className="property-details">
                          {property.bedrooms} bed • {property.bathrooms} bath
                        </p>
                      </div>
                      <div className="property-item-price">
                        <span className="price">${property.price}</span>
                        <span className="period">/month</span>
                        <span className={`status ${property.available ? 'available' : 'unavailable'}`}>
                          {property.available ? 'Available' : 'Rented'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't saved any properties yet</p>
                  <Link to="/properties" className="btn-primary">Browse Properties</Link>
                </div>
              )}
            </>
          )}
        </div>

        <div className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3>Recent Messages</h3>
            {messages.length > 0 ? (
              <div className="message-list">
                {messages.map(msg => (
                  <div key={msg._id} className="message-preview">
                    <div className="message-avatar">
                      {msg.senderId.firstName[0]}{msg.senderId.lastName[0]}
                    </div>
                    <div className="message-content">
                      <p className="message-sender">
                        {msg.senderId.firstName} {msg.senderId.lastName}
                      </p>
                      <p className="message-text">{msg.content.substring(0, 50)}...</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No messages yet</p>
            )}
            <Link to="/messages" className="view-all-link">View All Messages →</Link>
          </div>

          <div className="sidebar-section stats-section">
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              {user?.userType === 'landlord' ? (
                <>
                  <div className="stat-card">
                    <span className="stat-value">{properties.length}</span>
                    <span className="stat-label">Properties</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{properties.filter(p => p.available).length}</span>
                    <span className="stat-label">Available</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{messages.length}</span>
                    <span className="stat-label">Messages</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-card">
                    <span className="stat-value">{savedProperties.length}</span>
                    <span className="stat-label">Saved</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{messages.length}</span>
                    <span className="stat-label">Messages</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Applications</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
