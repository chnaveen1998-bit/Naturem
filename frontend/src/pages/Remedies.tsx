import React, { useEffect, useState } from 'react';
import { remedyService } from '../services/remedyService';
import { Remedy } from '../types';
import RemedyCard from '../components/RemedyCard';

const Remedies: React.FC = () => {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRemedies();
  }, []);

  const fetchRemedies = async () => {
    try {
      const data = await remedyService.getRemedies({ status: 'approved' });
      setRemedies(data.remedies);
    } catch (err) {
      setError('Failed to load remedies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRemedies();
      return;
    }

    setLoading(true);
    try {
      const data = await remedyService.searchRemedies(searchQuery);
      setRemedies(data.remedies);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading remedies...</div>;
  }

  return (
    <div>
      <h1>Natural Remedies</h1>
      <form onSubmit={handleSearch} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search remedies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" className="button">
            Search
          </button>
        </div>
      </form>
      {error && <div className="error">{error}</div>}
      {remedies.length === 0 ? (
        <p>No remedies found.</p>
      ) : (
        <div className="grid">
          {remedies.map((remedy) => (
            <RemedyCard key={remedy.id} remedy={remedy} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Remedies;
