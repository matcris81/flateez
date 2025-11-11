import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Rental Connect</span>
          </Link>
          
          <div className="nav-center">
            <Link 
              to="/properties" 
              className={`nav-link ${isActive('/properties') ? 'active' : ''}`}
            >
              <span className="nav-icon">🏢</span>
              <span>Properties</span>
            </Link>
            <Link 
              to="/renters" 
              className={`nav-link ${isActive('/renters') ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span>Renters</span>
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/messages" 
                  className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
                >
                  <span className="nav-icon">💬</span>
                  <span>Messages</span>
                </Link>
              </>
            )}
          </div>

          <div className="nav-right">
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="user-profile-link">
                  <div className="user-avatar">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.firstName}</span>
                    <span className="user-type">{user.userType}</span>
                  </div>
                </Link>
                <button onClick={logout} className="logout-btn" title="Logout">
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="signup-btn">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
