import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Naturem</h1>
        <p className="hero-subtitle">
          Discover natural remedies and holistic health solutions
        </p>
        <div className="hero-actions">
          <Link to="/remedies" className="btn btn-primary">
            Explore Remedies
          </Link>
          <Link to="/boards" className="btn btn-secondary">
            Join Community
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🌿 Natural Solutions</h3>
          <p>Browse our extensive collection of natural remedies for common ailments</p>
        </div>
        <div className="feature-card">
          <h3>👥 Community Driven</h3>
          <p>Share experiences and learn from others in our supportive community</p>
        </div>
        <div className="feature-card">
          <h3>🔍 Smart Search</h3>
          <p>Find the perfect remedy with our advanced search capabilities</p>
        </div>
        <div className="feature-card">
          <h3>📱 Mobile Friendly</h3>
          <p>Access remedies anywhere with our progressive web app</p>
        </div>
      </section>
    </div>
  );
}
