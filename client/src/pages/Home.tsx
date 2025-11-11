import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Find Your Perfect Home</h1>
        <p>Connect with landlords and discover amazing rental properties</p>
        <div className="cta-buttons">
          <Link to="/properties" className="btn-large btn-primary">Browse Properties</Link>
          <Link to="/register" className="btn-large btn-outline">Get Started</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>For Renters</h3>
          <p>Search and filter properties, save favorites, and connect directly with landlords</p>
        </div>
        <div className="feature-card">
          <h3>For Landlords</h3>
          <p>List your properties, manage inquiries, and find quality tenants</p>
        </div>
        <div className="feature-card">
          <h3>Direct Communication</h3>
          <p>Built-in messaging system for seamless landlord-renter communication</p>
        </div>
      </section>
    </div>
  );
}
