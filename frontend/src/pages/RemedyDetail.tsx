import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { remedyService } from '../services/remedy';
import type { Remedy } from '../types';

export default function RemedyDetail() {
  const { id } = useParams<{ id: string }>();
  const [remedy, setRemedy] = useState<Remedy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadRemedy(id);
    }
  }, [id]);

  const loadRemedy = async (remedyId: string) => {
    try {
      setLoading(true);
      const data = await remedyService.getById(remedyId);
      setRemedy(data);
    } catch (err) {
      setError('Failed to load remedy');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!remedy) return <div className="error-message">Remedy not found</div>;

  return (
    <div className="remedy-detail">
      <div className="remedy-header">
        <h1>{remedy.title}</h1>
        <span className="remedy-category">{remedy.category}</span>
      </div>

      <div className="remedy-meta">
        <span>By {remedy.author_name || 'Anonymous'}</span>
        <span>{remedy.views} views</span>
        <span>Created: {new Date(remedy.created_at).toLocaleDateString()}</span>
      </div>

      <section className="remedy-section">
        <h2>Description</h2>
        <p>{remedy.description}</p>
      </section>

      {remedy.ingredients && Array.isArray(remedy.ingredients) && remedy.ingredients.length > 0 && (
        <section className="remedy-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {remedy.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>
      )}

      {remedy.instructions && (
        <section className="remedy-section">
          <h2>Instructions</h2>
          <p className="instructions">{remedy.instructions}</p>
        </section>
      )}
    </div>
  );
}
