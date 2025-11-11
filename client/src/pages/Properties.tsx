import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import './Properties.css';

interface Property {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  address: { city: string; state: string };
  propertyType: string;
  images: string[];
  squareFeet?: number;
}

export default function Properties() {
  const user = useAuthStore((state) => state.user);
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: ''
  });

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const { data } = await api.get('/properties', { params });
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    try {
      const { data } = await api.get('/saved');
      const savedIds = new Set(data.map((p: any) => p._id));
      setSavedProperties(savedIds);
    } catch (error) {
      console.error('Failed to fetch saved properties');
    }
  };

  const toggleSave = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please login to save properties');
      return;
    }

    try {
      const isSaved = savedProperties.has(propertyId);
      
      if (isSaved) {
        await api.delete(`/saved/${propertyId}`);
        setSavedProperties((prev) => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      } else {
        await api.post(`/saved/${propertyId}`);
        setSavedProperties((prev) => new Set(prev).add(propertyId));
      }
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      alert(error.response?.data?.error || 'Failed to save property');
    }
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: ''
    });
    setTimeout(fetchProperties, 0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="properties-page">
      <div className="properties-header">
        <h1>Browse Properties</h1>
        <p>Find your perfect rental home from our curated listings</p>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <h3>Filter Properties</h3>
          <button onClick={clearFilters} className="clear-filters">
            Clear All
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              placeholder="e.g. San Francisco"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={fetchProperties} className="btn-primary">
            🔍 Search Properties
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : (
        <>
          <div className="results-header">
            <p className="results-count">
              <strong>{properties.length}</strong> {properties.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="properties-grid">
              {properties.map((property) => (
                <div key={property._id} className="property-card-wrapper">
                  <Link
                    to={`/properties/${property._id}`}
                    className="property-card"
                  >
                    <div className="property-image">
                      {property.images[0] ? (
                        <img src={property.images[0]} alt={property.title} />
                      ) : (
                        <div className="no-image">🏠 No Image Available</div>
                      )}
                      <span className="property-badge">{property.propertyType}</span>
                      {user && user.userType === 'renter' && (
                        <button
                          className={`save-btn ${savedProperties.has(property._id) ? 'saved' : ''}`}
                          onClick={(e) => toggleSave(property._id, e)}
                          title={savedProperties.has(property._id) ? 'Remove from saved' : 'Save property'}
                        >
                          {savedProperties.has(property._id) ? '❤️' : '🤍'}
                        </button>
                      )}
                    </div>
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <div className="price">
                      ${property.price.toLocaleString()}
                      <span className="price-period">/month</span>
                    </div>
                    <div className="details">
                      <span className="detail-item">
                        🛏️ {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
                      </span>
                      <span className="detail-item">
                        🚿 {property.bathrooms} bath
                      </span>
                      {property.squareFeet && (
                        <span className="detail-item">
                          📐 {property.squareFeet} sq ft
                        </span>
                      )}
                    </div>
                    <p className="location">
                      {property.address.city}, {property.address.state}
                    </p>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No properties found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
