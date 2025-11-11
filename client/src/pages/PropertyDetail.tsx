import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [property, setProperty] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);

  useEffect(() => {
    fetchProperty();
    if (user && user.userType === 'renter') {
      checkIfSaved();
    }
  }, [id, user]);

  const checkIfSaved = async () => {
    try {
      const { data } = await api.get(`/saved/check/${id}`);
      setIsSaved(data.saved);
    } catch (error) {
      console.error('Failed to check saved status');
    }
  };

  const fetchProperty = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/messages', {
        receiverId: property.landlordId._id,
        propertyId: id,
        content: message,
      });
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      alert('Please login to save properties');
      navigate('/login');
      return;
    }

    if (user.userType !== 'renter') {
      return;
    }

    setSavingProperty(true);

    try {
      if (isSaved) {
        await api.delete(`/saved/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/saved/${id}`);
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      alert(error.response?.data?.error || 'Failed to save property');
    } finally {
      setSavingProperty(false);
    }
  };

  if (loading) {
    return (
      <div className="property-detail">
        <div className="loading-detail">
          <div className="loading-spinner-large"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="empty-state">
          <h3>Property not found</h3>
          <Link to="/properties" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to listings
      </button>

      <div className="property-detail-grid">
        <div className="property-main">
          <div className="property-header-section">
            <div className="property-header-top">
              <div>
                <span className="property-type-badge">{property.propertyType}</span>
                <h1 className="property-title">{property.title}</h1>
                <div className="property-location-header">
                  📍 {property.address.street}, {property.address.city},{' '}
                  {property.address.state} {property.address.zipCode}
                </div>
              </div>
              {user && user.userType === 'renter' && (
                <button
                  className={`save-btn-large ${isSaved ? 'saved' : ''}`}
                  onClick={toggleSave}
                  disabled={savingProperty}
                  title={isSaved ? 'Remove from saved' : 'Save property'}
                >
                  <span className="save-icon">{isSaved ? '❤️' : '🤍'}</span>
                  <span className="save-text">
                    {isSaved ? 'Saved' : 'Save'}
                  </span>
                </button>
              )}
            </div>

            <div className="property-price-section">
              <span className="property-price-large">
                ${property.price.toLocaleString()}
              </span>
              <span className="property-price-period">/month</span>
            </div>

            <div className="property-stats">
              <div className="stat-box">
                <div className="stat-icon">🛏️</div>
                <div className="stat-value">
                  {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                </div>
                <div className="stat-label">
                  {property.bedrooms === 0 ? '' : 'Bedrooms'}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🚿</div>
                <div className="stat-value">{property.bathrooms}</div>
                <div className="stat-label">Bathrooms</div>
              </div>
              {property.squareFeet && (
                <div className="stat-box">
                  <div className="stat-icon">📐</div>
                  <div className="stat-value">
                    {property.squareFeet.toLocaleString()}
                  </div>
                  <div className="stat-label">Sq Ft</div>
                </div>
              )}
            </div>

            {property.availableFrom && (
              <div
                className={`availability-badge ${
                  property.available ? '' : 'unavailable'
                }`}
              >
                {property.available ? '✓' : '✗'}{' '}
                {property.available
                  ? `Available from ${new Date(
                      property.availableFrom
                    ).toLocaleDateString()}`
                  : 'Currently Unavailable'}
              </div>
            )}
          </div>

          {property.images && property.images.length > 0 ? (
            <div className="property-images-section">
              <h2>Photos ({property.images.length})</h2>
              <div className="property-image-gallery">
                {property.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="gallery-image"
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setGalleryOpen(true);
                    }}
                  >
                    <img src={img} alt={`${property.title} - ${idx + 1}`} />
                    <div className="image-overlay">
                      <span>View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="property-images-section">
              <div className="no-images">📷 No photos available</div>
            </div>
          )}

          {galleryOpen && property.images && (
            <div className="gallery-modal" onClick={() => setGalleryOpen(false)}>
              <button
                className="gallery-close"
                onClick={() => setGalleryOpen(false)}
              >
                ✕
              </button>
              <button
                className="gallery-nav gallery-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? property.images.length - 1 : prev - 1
                  );
                }}
              >
                ‹
              </button>
              <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - ${currentImageIndex + 1}`}
                />
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              <button
                className="gallery-nav gallery-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === property.images.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                ›
              </button>
            </div>
          )}

          <div className="property-description-section">
            <h2>Description</h2>
            <p className="property-description">{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="property-amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="amenity-item">
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="property-address-section">
            <h2>Location</h2>
            <div className="address-details">
              <div className="address-line">
                <strong>Address:</strong> {property.address.street}
              </div>
              <div className="address-line">
                <strong>City:</strong> {property.address.city}
              </div>
              <div className="address-line">
                <strong>State:</strong> {property.address.state}
              </div>
              <div className="address-line">
                <strong>ZIP Code:</strong> {property.address.zipCode}
              </div>
            </div>
          </div>
        </div>

        <div className="property-sidebar">
          <div className="landlord-card">
            <h3>Property Owner</h3>
            <div className="landlord-info">
              <div className="landlord-avatar">
                {property.landlordId.firstName[0]}
                {property.landlordId.lastName[0]}
              </div>
              <div className="landlord-details">
                <h4>
                  {property.landlordId.firstName} {property.landlordId.lastName}
                </h4>
                <p>{property.landlordId.email}</p>
                {property.landlordId.phone && (
                  <p>📞 {property.landlordId.phone}</p>
                )}
              </div>
            </div>
            {property.landlordId.bio && (
              <p className="landlord-bio">{property.landlordId.bio}</p>
            )}
          </div>

          {user && user.userType === 'renter' ? (
            <div className="contact-section">
              <h3>Contact Landlord</h3>
              {success && (
                <div className="success-message">
                  ✓ Message sent successfully!
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
              <form className="message-form" onSubmit={sendMessage}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this property. When can I schedule a viewing?"
                  required
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !message.trim()}>
                  {sending ? 'Sending...' : '📧 Send Message'}
                </button>
              </form>
            </div>
          ) : !user ? (
            <div className="contact-section">
              <div className="login-prompt">
                <p>
                  <Link to="/login">Log in</Link> or{' '}
                  <Link to="/register">sign up</Link> as a renter to contact
                  the landlord
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
