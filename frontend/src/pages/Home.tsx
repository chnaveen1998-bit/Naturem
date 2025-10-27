import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to Naturem
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Discover and share natural remedies for better health and wellness
        </p>
        <Link to="/remedies" className="button">
          Explore Remedies
        </Link>
      </section>

      <section className="grid" style={{ marginTop: '3rem' }}>
        <div className="card">
          <h3>🔍 Search</h3>
          <p>Find natural remedies using our powerful search with BM25 and semantic matching.</p>
        </div>
        <div className="card">
          <h3>📋 Organize</h3>
          <p>Create custom boards to save and organize your favorite remedies.</p>
        </div>
        <div className="card">
          <h3>✍️ Contribute</h3>
          <p>Share your knowledge by submitting your own natural remedy recipes.</p>
        </div>
        <div className="card">
          <h3>📱 PWA</h3>
          <p>Install as an app and access remedies offline, anytime, anywhere.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
