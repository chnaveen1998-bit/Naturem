import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Board } from '../types';

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const response = await api.get<Board[]>('/api/boards');
      setBoards(response.data);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading boards...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="boards-page">
      <h1>Community Boards</h1>
      <p className="boards-description">
        Join discussions, share experiences, and connect with others interested in natural remedies
      </p>

      <div className="boards-grid">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <h3>{board.name}</h3>
            <p>{board.description}</p>
            <button className="btn btn-primary">View Board</button>
          </div>
        ))}
      </div>
    </div>
  );
}
