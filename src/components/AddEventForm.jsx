import { useState } from 'react';
import './AddEventForm.css';

const EMOJIS = ['🍽️', '🚿', '📚', '🏫', '⚽', '🎵', '🏠', '📺', '😴', '🎵', '🎪', '📖'];

export default function AddEventForm({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🍽️',
    time: '09:00',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({ name: '', emoji: '🍽️', time: '09:00' });
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h2>Add Event</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Activity Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Breakfast"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="emoji">Emoji</label>
            <div className="emoji-picker">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-btn ${formData.emoji === emoji ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
