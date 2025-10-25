import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { remedyService } from '../services/remedy';
import type { Remedy } from '../types';

export default function RemedyList() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRemedies();
  }, [page]);

  const loadRemedies = async () => {
    try {
      setLoading(true);
      const response = await remedyService.getAll(page);
      setRemedies(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Failed to load remedies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadRemedies();
      return;
    }

    try {
      setLoading(true);
      const response = await remedyService.search(searchQuery);
      setRemedies(response.results);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading remedies...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="remedy-list-page">
      <div className="page-header">
        <h1>Natural Remedies</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search remedies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="remedy-grid">
        {remedies.map((remedy) => (
          <div key={remedy.id} className="remedy-card">
            <h3>{remedy.title}</h3>
            <p className="remedy-category">{remedy.category}</p>
            <p className="remedy-description">{remedy.description.substring(0, 150)}...</p>
            <div className="remedy-meta">
              <span>By {remedy.author_name || 'Anonymous'}</span>
              <span>{remedy.views} views</span>
            </div>
            <Link to={`/remedies/${remedy.id}`} className="btn btn-secondary">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {!searchQuery && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
