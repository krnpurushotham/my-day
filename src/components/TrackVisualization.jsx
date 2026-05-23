import { useState, useEffect } from 'react';
import Character from './Character';
import './TrackVisualization.css';

export default function TrackVisualization({ events }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentActivityName, setCurrentActivityName] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(null);

  // Update time and activity tracking
  useEffect(() => {
    const updateState = () => {
      const now = new Date();
      setCurrentTime(now);

      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      // Find the current or most recent activity
      const sortedEvents = events.sort((a, b) => b.time.localeCompare(a.time));
      const currentOrPastActivity = sortedEvents.find(e => e.time <= currentTimeStr);

      if (currentOrPastActivity) {
        setCurrentActivityName(currentOrPastActivity.name);
        
        // Check if we just transitioned to a new activity
        if (lastActivityTime !== currentOrPastActivity.time) {
          setLastActivityTime(currentOrPastActivity.time);
          // Trigger walk animation when activity changes
          setIsWalking(true);
          setTimeout(() => setIsWalking(false), 1000); // Walk for 1 second
        }
      } else {
        setCurrentActivityName(null);
      }
    };

    updateState();
    const interval = setInterval(updateState, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [events, lastActivityTime]);

  // Calculate character position along the timeline
  useEffect(() => {
    const calculatePosition = () => {
      const now = new Date();
      const wakeTime = 6; // 6 AM
      const sleepTime = 22; // 10 PM
      const totalHours = sleepTime - wakeTime;
      const currentHour = now.getHours() + now.getMinutes() / 60;

      let position = 0;
      if (currentHour < wakeTime) {
        position = 0;
      } else if (currentHour > sleepTime) {
        position = 100;
      } else {
        position = ((currentHour - wakeTime) / totalHours) * 100;
      }

      setCharacterPosition(Math.max(0, Math.min(100, position)));
    };

    calculatePosition();
    const interval = setInterval(calculatePosition, 30000); // Update every 30 seconds for smooth movement

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="track-visualization">
      <div className="track-background">
        <div className="sky"></div>
        <div className="clouds">
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
        </div>
        <div className="hills">
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
        </div>
      </div>

      {/* Timeline labels showing wake and sleep times */}
      <div className="timeline-labels">
        <span className="label-time">6 AM</span>
        <span className="label-time">9 AM</span>
        <span className="label-time">12 PM</span>
        <span className="label-time">3 PM</span>
        <span className="label-time">6 PM</span>
        <span className="label-time">9 PM</span>
      </div>

      {/* Character positioned along the timeline with smooth movement */}
      <div
        className={`character-container ${isWalking ? 'walking' : ''}`}
        style={{
          left: `${characterPosition}%`,
          transition: isWalking ? 'none' : 'left 30s linear',
        }}
      >
        <Character
          activityName={currentActivityName}
          isWalking={isWalking}
          isPaused={false}
          animationSpeed="normal"
        />
      </div>

      {/* Time indicator */}
      <div className="time-indicator">
        <span className="time-display">
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <span className="activity-display">
          {currentActivityName ? `📍 ${currentActivityName}` : 'Sleeping...'}
        </span>
      </div>

      {/* Progress bar showing day progress */}
      <div className="day-progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${characterPosition}%` }}
        ></div>
      </div>
    </div>
  );
}
