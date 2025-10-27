import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { remedyService } from '../services/remedyService';
import { Remedy } from '../types';
import { useAuth } from '../context/AuthContext';

const RemedyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [remedy, setRemedy] = useState<Remedy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      fetchRemedy(parseInt(id));
    }
  }, [id]);

  const fetchRemedy = async (remedyId: number) => {
    try {
      const data = await remedyService.getRemedy(remedyId);
      setRemedy(data.remedy);
    } catch (err) {
      setError('Failed to load remedy');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!remedy || !isAuthenticated) return;

    try {
      await remedyService.likeRemedy(remedy.id);
      fetchRemedy(remedy.id);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !remedy) {
    return <div className="error">{error || 'Remedy not found'}</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>{remedy.title}</h1>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{remedy.description}</p>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <span>👁️ {remedy.views} views</span>
          <span style={{ marginLeft: '1rem' }}>❤️ {remedy.likes} likes</span>
          {isAuthenticated && (
            <button
              onClick={handleLike}
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Like
            </button>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Ingredients</h3>
          <ul>
            {remedy.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Instructions</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{remedy.instructions}</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Category</h3>
          <p>{remedy.category}</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Tags</h3>
          <div>
            {remedy.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  background: '#e0e0e0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  marginRight: '0.5rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemedyDetail;
