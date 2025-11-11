import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'renter' as 'landlord' | 'renter'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label>I am a:</label>
          <div className="user-type-selector">
            <button
              type="button"
              className={formData.userType === 'renter' ? 'active' : ''}
              onClick={() => setFormData({...formData, userType: 'renter'})}
            >
              Renter
            </button>
            <button
              type="button"
              className={formData.userType === 'landlord' ? 'active' : ''}
              onClick={() => setFormData({...formData, userType: 'landlord'})}
            >
              Landlord
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
