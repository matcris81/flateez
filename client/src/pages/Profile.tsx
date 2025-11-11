import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
  });

  const [renterProfile, setRenterProfile] = useState({
    yearsOfExperience: '',
    employmentStatus: '',
    monthlyIncome: '',
    hasPets: false,
    petDetails: '',
    smoker: false,
    previousAddresses: [''],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        avatar: data.avatar || '',
      });

      if (data.renterProfile) {
        setRenterProfile({
          yearsOfExperience: data.renterProfile.yearsOfExperience?.toString() || '',
          employmentStatus: data.renterProfile.employmentStatus || '',
          monthlyIncome: data.renterProfile.monthlyIncome?.toString() || '',
          hasPets: data.renterProfile.hasPets || false,
          petDetails: data.renterProfile.petDetails || '',
          smoker: data.renterProfile.smoker || false,
          previousAddresses: data.renterProfile.previousAddresses?.length > 0
            ? data.renterProfile.previousAddresses
            : [''],
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        avatar: formData.avatar,
      };

      if (user?.userType === 'renter') {
        updateData.renterProfile = {
          yearsOfExperience: renterProfile.yearsOfExperience
            ? Number(renterProfile.yearsOfExperience)
            : undefined,
          employmentStatus: renterProfile.employmentStatus || undefined,
          monthlyIncome: renterProfile.monthlyIncome
            ? Number(renterProfile.monthlyIncome)
            : undefined,
          hasPets: renterProfile.hasPets,
          petDetails: renterProfile.petDetails || undefined,
          smoker: renterProfile.smoker,
          previousAddresses: renterProfile.previousAddresses.filter((addr) => addr.trim() !== ''),
        };
      }

      const { data } = await api.put('/users/profile', updateData);
      
      // Update auth store with new user data
      if (user) {
        setAuth({ ...user, firstName: data.firstName, lastName: data.lastName }, useAuthStore.getState().token!);
      }

      setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    setRenterProfile({
      ...renterProfile,
      previousAddresses: [...renterProfile.previousAddresses, ''],
    });
  };

  const removeAddress = (index: number) => {
    const newAddresses = renterProfile.previousAddresses.filter((_, i) => i !== index);
    setRenterProfile({
      ...renterProfile,
      previousAddresses: newAddresses.length > 0 ? newAddresses : [''],
    });
  };

  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...renterProfile.previousAddresses];
    newAddresses[index] = value;
    setRenterProfile({ ...renterProfile, previousAddresses: newAddresses });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Edit Profile</h1>
        <p>Update your personal information and preferences</p>
      </div>

      {success && (
        <div className="success-banner-top">
          ✓ Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="error-banner-top">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="555-0123"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Profile Photo</label>
            <div className="avatar-upload-container">
              {formData.avatar && (
                <div className="avatar-preview">
                  <img src={formData.avatar} alt="Avatar preview" />
                </div>
              )}
              <div className="upload-controls">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Image is too large. Please select an image smaller than 5MB.');
                        return;
                      }

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const img = new Image();
                        img.onload = () => {
                          // Compress image to max 800x800
                          const canvas = document.createElement('canvas');
                          let width = img.width;
                          let height = img.height;
                          const maxSize = 800;

                          if (width > height && width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                          } else if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                          }

                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          ctx?.drawImage(img, 0, 0, width, height);

                          // Convert to base64 with compression
                          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
                          setFormData({ ...formData, avatar: compressedImage });
                        };
                        img.src = reader.result as string;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="upload-btn">
                  {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                </label>
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                    className="remove-photo-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <small>Recommended: Square image, at least 200x200px</small>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {user?.userType === 'renter' && (
          <>
            <div className="form-section">
              <h2>Renter Profile</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Years of Rental Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={renterProfile.yearsOfExperience}
                    onChange={(e) =>
                      setRenterProfile({ ...renterProfile, yearsOfExperience: e.target.value })
                    }
                    placeholder="5"
                  />
                </div>

                <div className="form-group">
                  <label>Employment Status</label>
                  <input
                    type="text"
                    value={renterProfile.employmentStatus}
                    onChange={(e) =>
                      setRenterProfile({ ...renterProfile, employmentStatus: e.target.value })
                    }
                    placeholder="Full-time Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Income</label>
                  <input
                    type="number"
                    min="0"
                    value={renterProfile.monthlyIncome}
                    onChange={(e) =>
                      setRenterProfile({ ...renterProfile, monthlyIncome: e.target.value })
                    }
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={renterProfile.hasPets}
                      onChange={(e) =>
                        setRenterProfile({ ...renterProfile, hasPets: e.target.checked })
                      }
                    />
                    <span>I have pets</span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={renterProfile.smoker}
                      onChange={(e) =>
                        setRenterProfile({ ...renterProfile, smoker: e.target.checked })
                      }
                    />
                    <span>I am a smoker</span>
                  </label>
                </div>
              </div>

              {renterProfile.hasPets && (
                <div className="form-group">
                  <label>Pet Details</label>
                  <textarea
                    value={renterProfile.petDetails}
                    onChange={(e) =>
                      setRenterProfile({ ...renterProfile, petDetails: e.target.value })
                    }
                    rows={3}
                    placeholder="e.g., Golden Retriever, 3 years old, well-trained"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Previous Addresses</label>
                {renterProfile.previousAddresses.map((address, index) => (
                  <div key={index} className="address-input-group">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => updateAddress(index, e.target.value)}
                      placeholder="123 Main St, City, State (2020-2023)"
                    />
                    {renterProfile.previousAddresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addAddress} className="add-btn">
                  + Add Address
                </button>
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={saving} 
            className="save-btn"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
