import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './Renters.css';

interface Renter {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  renterProfile?: {
    yearsOfExperience?: number;
    employmentStatus?: string;
    hasPets?: boolean;
    smoker?: boolean;
    feedbackCount?: number;
    rating?: number;
    references?: any[];
  };
  createdAt: string;
}

export default function Renters() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hasPets: '',
    smoker: '',
    minExperience: ''
  });

  useEffect(() => {
    fetchRenters();
  }, []);

  const fetchRenters = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/renters');
      setRenters(data);
    } catch (error) {
      console.error('Failed to fetch renters');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Trigger re-render by updating state
    setRenters([...renters]);
  };

  const filteredRenters = renters.filter((renter) => {
    // Filter by pets
    if (filters.hasPets !== '') {
      const wantsPets = filters.hasPets === 'yes';
      const renterHasPets = renter.renterProfile?.hasPets === true;
      
      if (wantsPets && !renterHasPets) {
        return false;
      }
      if (!wantsPets && renterHasPets) {
        return false;
      }
    }

    // Filter by smoking
    if (filters.smoker !== '') {
      const wantsSmoker = filters.smoker === 'yes';
      const renterIsSmoker = renter.renterProfile?.smoker === true;
      
      if (wantsSmoker && !renterIsSmoker) {
        return false;
      }
      if (!wantsSmoker && renterIsSmoker) {
        return false;
      }
    }

    // Filter by minimum experience
    if (filters.minExperience !== '') {
      const minExp = Number(filters.minExperience);
      const renterExp = renter.renterProfile?.yearsOfExperience || 0;
      if (renterExp < minExp) {
        return false;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({ hasPets: '', smoker: '', minExperience: '' });
  };

  return (
    <div className="renters-page">
      <div className="renters-header">
        <h1>Find Renters</h1>
        <p>Browse profiles of potential tenants looking for their next home</p>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <h3>Filter Renters</h3>
          <button onClick={clearFilters} className="clear-filters">
            Clear All
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Pets</label>
            <select
              value={filters.hasPets}
              onChange={(e) =>
                setFilters({ ...filters, hasPets: e.target.value })
              }
            >
              <option value="">Any</option>
              <option value="yes">Has Pets</option>
              <option value="no">No Pets</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Smoking</label>
            <select
              value={filters.smoker}
              onChange={(e) =>
                setFilters({ ...filters, smoker: e.target.value })
              }
            >
              <option value="">Any</option>
              <option value="yes">Smoker</option>
              <option value="no">Non-Smoker</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min. Experience (years)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={filters.minExperience}
              onChange={(e) =>
                setFilters({ ...filters, minExperience: e.target.value })
              }
            />
          </div>
        </div>

        <div className="active-filters">
          {filters.hasPets && (
            <span className="active-filter">
              {filters.hasPets === 'yes' ? 'Has Pets' : 'No Pets'}
              <button
                onClick={() => setFilters({ ...filters, hasPets: '' })}
                className="remove-filter"
              >
                ✕
              </button>
            </span>
          )}
          {filters.smoker && (
            <span className="active-filter">
              {filters.smoker === 'yes' ? 'Smoker' : 'Non-Smoker'}
              <button
                onClick={() => setFilters({ ...filters, smoker: '' })}
                className="remove-filter"
              >
                ✕
              </button>
            </span>
          )}
          {filters.minExperience && (
            <span className="active-filter">
              {filters.minExperience}+ years experience
              <button
                onClick={() => setFilters({ ...filters, minExperience: '' })}
                className="remove-filter"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading renters...</p>
        </div>
      ) : (
        <>
          <div className="results-header">
            <p className="results-count">
              <strong>{filteredRenters.length}</strong> {filteredRenters.length === 1 ? 'renter' : 'renters'} found
            </p>
          </div>

          {filteredRenters.length > 0 ? (
            <div className="renters-grid">
              {filteredRenters.map((renter) => (
                <div key={renter._id} className="renter-card-wrapper">
                  <Link
                    to={`/renters/${renter._id}`}
                    className="renter-card"
                  >
                  <div className="renter-card-header">
                    <div className="renter-avatar-large">
                      {renter.avatar ? (
                        <img src={renter.avatar} alt={`${renter.firstName} ${renter.lastName[0]}.`} />
                      ) : (
                        <span>{renter.firstName[0]}{renter.lastName[0]}</span>
                      )}
                    </div>
                    <div className="renter-header-info">
                      <h3>{renter.firstName} {renter.lastName[0]}.</h3>
                      {renter.renterProfile?.rating && (
                        <div className="rating">
                          {'⭐'.repeat(Math.round(renter.renterProfile.rating))}
                          <span className="rating-text">
                            {renter.renterProfile.rating.toFixed(1)}
                          </span>
                          {renter.renterProfile?.feedbackCount && renter.renterProfile.feedbackCount > 0 && (
                            <span className="review-count">
                              ({renter.renterProfile.feedbackCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="renter-info">
                    {renter.bio && (
                      <p className="renter-bio">{renter.bio}</p>
                    )}
                    
                    <div className="renter-stats">
                      {renter.renterProfile?.yearsOfExperience && (
                        <div className="stat-item">
                          <span className="stat-icon">📅</span>
                          <div>
                            <div className="stat-label">Experience</div>
                            <div className="stat-value">{renter.renterProfile.yearsOfExperience} years</div>
                          </div>
                        </div>
                      )}
                      {renter.renterProfile?.employmentStatus && (
                        <div className="stat-item">
                          <span className="stat-icon">💼</span>
                          <div>
                            <div className="stat-label">Employment</div>
                            <div className="stat-value">{renter.renterProfile.employmentStatus}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="renter-badges">
                      {renter.renterProfile?.hasPets ? (
                        <span className="badge badge-neutral">🐾 Has Pets</span>
                      ) : (
                        <span className="badge badge-positive">No Pets</span>
                      )}
                      {renter.renterProfile?.smoker === false && (
                        <span className="badge badge-positive">🚭 Non-Smoker</span>
                      )}
                      {renter.renterProfile?.references && renter.renterProfile.references.length > 0 && (
                        <span className="badge badge-highlight">
                          ✓ {renter.renterProfile.references.length} References
                        </span>
                      )}
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No renters found</h3>
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
