import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';

interface Stats {
  users: number;
  remedies: number;
  submissions: number;
  pendingSubmissions: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="grid" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {stats.users}
            </p>
          </div>
          <div className="card">
            <h3>Total Remedies</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {stats.remedies}
            </p>
          </div>
          <div className="card">
            <h3>Total Submissions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {stats.submissions}
            </p>
          </div>
          <div className="card">
            <h3>Pending Submissions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
              {stats.pendingSubmissions}
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <p>Admin features coming soon: User management, remedy approval, submission review, etc.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
