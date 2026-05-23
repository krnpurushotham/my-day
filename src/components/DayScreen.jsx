import { useState } from 'react';
import './DayScreen.css';
import TrackVisualization from './TrackVisualization';
import ActivityBlock from './ActivityBlock';
import AddEventForm from './AddEventForm';
import EditEventForm from './EditEventForm';

export default function DayScreen({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const editingEvent = events.find(e => e.id === editingEventId);

  const handleAddEvent = (eventData) => {
    onAddEvent(eventData);
    setShowAddForm(false);
  };

  const handleUpdateEvent = (eventData) => {
    onUpdateEvent(editingEventId, eventData);
    setEditingEventId(null);
  };

  const handleDeleteEvent = () => {
    onDeleteEvent(editingEventId);
    setEditingEventId(null);
  };

  return (
    <div className="day-screen">
      <div className="track-container">
        <TrackVisualization events={events} />
        
        <div className="activities-list">
          {events.length === 0 ? (
            <div className="no-events">
              <p>No events yet. Tap the sky to add one!</p>
            </div>
          ) : (
            <div className="activities">
              {events
                .sort((a, b) => {
                  const timeA = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
                  const timeB = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
                  return timeA - timeB;
                })
                .map(event => (
                  <ActivityBlock
                    key={event.id}
                    event={event}
                    onClick={() => setEditingEventId(event.id)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <AddEventForm
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddEvent}
        />
      )}

      {editingEventId && (
        <EditEventForm
          event={editingEvent}
          onClose={() => setEditingEventId(null)}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      <button
        className="fab-add"
        onClick={() => setShowAddForm(true)}
        title="Add event"
      >
        +
      </button>
    </div>
  );
}
