import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import './RenterDetail.css';

export default function RenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRenter();
  }, [id]);

  const fetchRenter = async () => {
    try {
      const { data } = await api.get(`/renters/${id}`);
      setRenter(data);
    } catch (error) {
      console.error('Failed to fetch renter');
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
        receiverId: renter._id,
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

  if (loading) {
    return (
      <div className="renter-detail">
        <div className="loading-detail">
          <div className="loading-spinner-large"></div>
          <p>Loading renter profile...</p>
        </div>
      </div>
    );
  }

  if (!renter) {
    return (
      <div className="renter-detail">
        <div className="empty-state">
          <h3>Renter not found</h3>
          <Link to="/renters" className="btn-primary">
            Back to Renters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="renter-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to renters
      </button>

      <div className="renter-detail-grid">
        <div className="renter-main">
          <div className="renter-header-section">
            <div className="renter-header-content">
              <div className="renter-avatar-xl">
                {renter.avatar ? (
                  <img src={renter.avatar} alt={`${renter.firstName} ${renter.lastName[0]}.`} />
                ) : (
                  <span>{renter.firstName[0]}{renter.lastName[0]}</span>
                )}
              </div>
              <div>
                <h1 className="renter-name">
                  {renter.firstName} {renter.lastName[0]}.
                </h1>
                <div className="member-since">
                  Member since {new Date(renter.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                {renter.renterProfile?.rating && (
                  <div className="rating-large">
                    {'⭐'.repeat(Math.round(renter.renterProfile.rating))}
                    <span className="rating-text">
                      {renter.renterProfile.rating.toFixed(1)} / 5.0
                    </span>
                    {renter.renterProfile.feedbackCount > 0 && (
                      <span className="review-count">
                        ({renter.renterProfile.feedbackCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {renter.bio && (
            <div className="detail-section">
              <h2>About</h2>
              <p className="bio-text">{renter.bio}</p>
            </div>
          )}

          <div className="detail-section">
            <h2>Renter Information</h2>
            <div className="info-grid">
              {renter.renterProfile?.yearsOfExperience && (
                <div className="info-item">
                  <div className="info-icon">📅</div>
                  <div>
                    <div className="info-label">Rental Experience</div>
                    <div className="info-value">
                      {renter.renterProfile.yearsOfExperience} years
                    </div>
                  </div>
                </div>
              )}
              {renter.renterProfile?.employmentStatus && (
                <div className="info-item">
                  <div className="info-icon">💼</div>
                  <div>
                    <div className="info-label">Employment</div>
                    <div className="info-value">
                      {renter.renterProfile.employmentStatus}
                    </div>
                  </div>
                </div>
              )}
              <div className="info-item">
                <div className="info-icon">🐾</div>
                <div>
                  <div className="info-label">Pets</div>
                  <div className="info-value">
                    {renter.renterProfile?.hasPets ? 'Has Pets' : 'No Pets'}
                  </div>
                  {renter.renterProfile?.petDetails && (
                    <div className="info-detail">{renter.renterProfile.petDetails}</div>
                  )}
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🚭</div>
                <div>
                  <div className="info-label">Smoking</div>
                  <div className="info-value">
                    {renter.renterProfile?.smoker ? 'Smoker' : 'Non-Smoker'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renter.renterProfile?.previousAddresses && renter.renterProfile.previousAddresses.length > 0 && (
            <div className="detail-section">
              <h2>Previous Addresses</h2>
              <div className="address-list">
                {renter.renterProfile.previousAddresses.map((address: string, idx: number) => (
                  <div key={idx} className="address-item">
                    📍 {address}
                  </div>
                ))}
              </div>
            </div>
          )}

          {renter.renterProfile?.references && renter.renterProfile.references.length > 0 && (
            <div className="detail-section">
              <h2>References</h2>
              <div className="references-info">
                <p className="references-available">
                  ✓ <strong>{renter.renterProfile.references.length} verified references</strong> available
                </p>
                <p className="references-note">
                  Reference contact information will be shared upon request after initial contact.
                </p>
                <div className="references-preview">
                  {renter.renterProfile.references.map((ref: any, idx: number) => (
                    <div key={idx} className="reference-preview-card">
                      <div className="reference-icon">👤</div>
                      <div>
                        <div className="reference-type">{ref.relationship}</div>
                        <div className="reference-status">Verified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="renter-sidebar">
          <div className="contact-card">
            <h3>Contact Renter</h3>
            <div className="privacy-notice">
              <p>
                <strong>Privacy Protected</strong>
              </p>
              <p>
                Contact information is kept private. Send a message to connect with this renter.
              </p>
            </div>
          </div>

          {user && user.userType === 'landlord' ? (
            <div className="message-card">
              <h3>Send Message</h3>
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
                  placeholder="Hi, I have a property that might interest you..."
                  required
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !message.trim()}>
                  {sending ? 'Sending...' : '📧 Send Message'}
                </button>
              </form>
            </div>
          ) : !user ? (
            <div className="message-card">
              <div className="login-prompt">
                <p>
                  <Link to="/login">Log in</Link> or{' '}
                  <Link to="/register">sign up</Link> as a landlord to contact
                  this renter
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
