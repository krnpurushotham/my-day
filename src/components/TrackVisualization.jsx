import { useState, useEffect } from 'react';
import Character from './Character';
import './TrackVisualization.css';

export default function TrackVisualization({ events }) {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time and activity every minute
  useEffect(() => {
    const updateCurrentActivity = () => {
      const now = new Date();
      setCurrentTime(now);

      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      // Find the current or most recent activity
      const currentOrPastActivity = events
        .filter(e => e.time <= currentTimeStr)
        .sort((a, b) => b.time.localeCompare(a.time))[0];

      setCurrentActivity(currentOrPastActivity?.name || null);
    };

    updateCurrentActivity();
    const interval = setInterval(updateCurrentActivity, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [events]);

  // Calculate character position along the timeline (0-100%)
  const getCharacterPosition = () => {
    const now = new Date();
    const wakeTime = 6; // 6 AM
    const sleepTime = 22; // 10 PM
    const totalHours = sleepTime - wakeTime;
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour < wakeTime) return 0;
    if (currentHour > sleepTime) return 100;

    const position = ((currentHour - wakeTime) / totalHours) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const characterPosition = getCharacterPosition();

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

      {/* Character positioned along the timeline */}
      <div
        className="character-container"
        style={{
          left: `${characterPosition}%`,
          transition: 'left 1s ease-in-out',
        }}
      >
        <Character
          currentActivity={currentActivity}
          isWalking={false}
          isPaused={false}
        />
      </div>

      {/* Time indicator */}
      <div className="time-indicator">
        {currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}
