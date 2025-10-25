import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const user = authService.getUser();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <div className="dashboard-sections">
        <section className="dashboard-card">
          <h3>My Submissions</h3>
          <p>View and manage your submitted remedies</p>
          <button className="btn btn-primary">View Submissions</button>
        </section>

        <section className="dashboard-card">
          <h3>Create New Remedy</h3>
          <p>Share your natural remedy with the community</p>
          <button className="btn btn-primary">Create Remedy</button>
        </section>

        <section className="dashboard-card">
          <h3>My Profile</h3>
          <p>Update your profile information</p>
          <button className="btn btn-primary">Edit Profile</button>
        </section>
      </div>
    </div>
  );
}
