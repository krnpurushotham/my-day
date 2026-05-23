import { useState, useEffect } from 'react';
import './ReplayOverlay.css';

export default function ReplayOverlay({
  events,
  isReplaying,
  onReplayComplete,
  replayProgress,
}) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [replayMessage, setReplayMessage] = useState('Starting your day...');

  // Sort events by time
  const sortedEvents = events.sort((a, b) => a.time.localeCompare(b.time));

  // Calculate total replay duration (2 seconds per activity + transitions)
  const totalDuration = sortedEvents.length * 2.5; // 2.5 seconds per activity

  // Update current activity based on progress
  useEffect(() => {
    if (!isReplaying) return;

    const eventDuration = 2.5; // seconds per event
    const currentIndex = Math.floor(replayProgress / eventDuration);

    if (currentIndex < sortedEvents.length) {
      setCurrentActivityIndex(currentIndex);
      const event = sortedEvents[currentIndex];
      setReplayMessage(`Now: ${event.name} at ${event.time}`);
    }

    // When replay is complete
    if (replayProgress >= totalDuration) {
      setReplayMessage('Great job today! 🎉');
    }
  }, [replayProgress, isReplaying, sortedEvents, totalDuration]);

  if (!isReplaying) return null;

  return (
    <div className="replay-overlay">
      {/* Dim background */}
      <div className="replay-dim"></div>

      {/* Replay info card */}
      <div className="replay-card">
        <div className="replay-header">
          <h2>📽️ How Was Your Day?</h2>
          <p className="replay-message">{replayMessage}</p>
        </div>

        {/* Activity counter */}
        <div className="activity-counter">
          <span className="counter-text">
            Activity {currentActivityIndex + 1} of {sortedEvents.length}
          </span>
          <div className="progress-dots">
            {sortedEvents.map((_, index) => (
              <div
                key={index}
                className={`dot ${
                  index < currentActivityIndex ? 'completed' : ''
                } ${index === currentActivityIndex ? 'current' : ''}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="replay-progress-bar">
          <div
            className="replay-progress-fill"
            style={{
              width: `${(replayProgress / totalDuration) * 100}%`,
            }}
          ></div>
        </div>

        {/* Activity list during replay */}
        <div className="activity-list-replay">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className={`activity-item-replay ${
                index < currentActivityIndex ? 'completed' : ''
              } ${index === currentActivityIndex ? 'current' : ''}`}
            >
              <span className="activity-emoji">{event.emoji}</span>
              <span className="activity-name">{event.name}</span>
              <span className="activity-time">{event.time}</span>
              {index < currentActivityIndex && (
                <span className="checkmark">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Replay complete message */}
        {replayProgress >= totalDuration && (
          <div className="replay-complete">
            <p>You had a great day! 🌟</p>
            <button
              className="btn-done"
              onClick={onReplayComplete}
            >
              Close Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
