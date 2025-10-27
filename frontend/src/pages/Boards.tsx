import React, { useEffect, useState } from 'react';
import { boardService } from '../services/boardService';
import { Board } from '../types';

const Boards: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await boardService.getBoards();
      setBoards(data.boards);
    } catch (err) {
      console.error('Failed to load boards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await boardService.createBoard(formData);
      setFormData({ name: '', description: '', is_public: false });
      setShowForm(false);
      fetchBoards();
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Boards</h1>
        <button className="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Board'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Create New Board</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                />
                {' '}Make public
              </label>
            </div>
            <button type="submit" className="button">
              Create Board
            </button>
          </form>
        </div>
      )}

      {boards.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>No boards yet. Create one to get started!</p>
      ) : (
        <div className="grid" style={{ marginTop: '2rem' }}>
          {boards.map((board) => (
            <div key={board.id} className="card">
              <h3>{board.name}</h3>
              {board.description && <p>{board.description}</p>}
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                {board.is_public ? '🌐 Public' : '🔒 Private'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Boards;
