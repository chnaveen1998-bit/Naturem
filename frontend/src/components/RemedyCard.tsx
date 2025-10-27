import React from 'react';
import { Link } from 'react-router-dom';
import { Remedy } from '../types';

interface RemedyCardProps {
  remedy: Remedy;
}

const RemedyCard: React.FC<RemedyCardProps> = ({ remedy }) => {
  return (
    <div className="card">
      <h3>{remedy.title}</h3>
      <p>{remedy.description}</p>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <span>👁️ {remedy.views} views</span>
        <span style={{ marginLeft: '1rem' }}>❤️ {remedy.likes} likes</span>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {remedy.tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-block',
              background: '#e0e0e0',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              marginRight: '0.5rem',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        to={`/remedies/${remedy.id}`}
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          color: 'var(--primary-color)',
        }}
      >
        View Details →
      </Link>
    </div>
  );
};

export default RemedyCard;
