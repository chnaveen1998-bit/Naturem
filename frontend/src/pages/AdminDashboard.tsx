import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { authService } from '../services/auth';

interface AdminStats {
  users: number;
  remedies: number;
  pendingSubmissions: number;
  posts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getUser();
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const response = await api.get<AdminStats>('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
          <div className="stat-card">
            <h3>Total Remedies</h3>
            <p className="stat-number">{stats.remedies}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Submissions</h3>
            <p className="stat-number">{stats.pendingSubmissions}</p>
          </div>
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-number">{stats.posts}</p>
          </div>
        </div>
      )}

      <div className="admin-actions">
        <button className="btn btn-primary">Manage Users</button>
        <button className="btn btn-primary">Review Submissions</button>
        <button className="btn btn-primary">Manage Boards</button>
      </div>
    </div>
  );
}
