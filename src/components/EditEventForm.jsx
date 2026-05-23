import { useState } from 'react';
import './EditEventForm.css';

const EMOJIS = ['🍽️', '🚿', '📚', '🏫', '⚽', '🎵', '🏠', '📺', '😴', '🎵', '🎪', '📖'];

export default function EditEventForm({ event, onClose, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    name: event.name,
    emoji: event.emoji,
    time: event.time,
  });

  const [showDelete, setShowDelete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onUpdate(formData);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h2>Edit Event</h2>
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
              Update
            </button>
          </div>

          {!showDelete ? (
            <button
              type="button"
              className="btn-delete-toggle"
              onClick={() => setShowDelete(true)}
            >
              Delete Event
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Delete this event?</p>
              <div className="delete-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
