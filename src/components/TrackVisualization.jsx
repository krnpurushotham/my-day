import { useState, useEffect } from 'react';
import Character from './Character';
import './TrackVisualization.css';

export default function TrackVisualization({ events }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentActivityName, setCurrentActivityName] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [pauseAtActivity, setPauseAtActivity] = useState(null);
  const [lastActivityTime, setLastActivityTime] = useState(null);

  // Helper: Convert time string to hours decimal (e.g., "14:30" = 14.5)
  const timeToHours = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Helper: Convert hours decimal to timeline position (0-100%)
  const hoursToPosition = (hours) => {
    const wakeTime = 6;
    const sleepTime = 22;
    const totalHours = sleepTime - wakeTime;

    if (hours < wakeTime) return 0;
    if (hours > sleepTime) return 100;

    const position = ((hours - wakeTime) / totalHours) * 100;
    return Math.max(0, Math.min(100, position));
  };

  // Update time and activity tracking
  useEffect(() => {
    const updateState = () => {
      const now = new Date();
      setCurrentTime(now);

      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      const currentHourDecimal = timeToHours(currentTimeStr);

      // Find current or most recent activity
      const sortedEvents = events.sort((a, b) => b.time.localeCompare(a.time));
      const currentOrPastActivity = sortedEvents.find(e => e.time <= currentTimeStr);

      if (currentOrPastActivity) {
        setCurrentActivityName(currentOrPastActivity.name);

        // Check if we just transitioned to a new activity
        if (lastActivityTime !== currentOrPastActivity.time) {
          setLastActivityTime(currentOrPastActivity.time);
          setIsWalking(true);
          setTimeout(() => setIsWalking(false), 1200); // Walk for 1.2 seconds
        }

        // Calculate pause position for current activity
        const activityHours = timeToHours(currentOrPastActivity.time);
        const nextActivity = sortedEvents.find(e => e.time > currentOrPastActivity.time);
        const nextActivityHours = nextActivity ? timeToHours(nextActivity.time) : 22; // Sleep time

        // Find next activity after this one
        const allFutureActivities = events.filter(e => e.time > currentOrPastActivity.time);
        const nextActualActivity = allFutureActivities.length > 0 
          ? allFutureActivities[0] 
          : null;

        // Position: center of activity duration
        const pausePosition = hoursToPosition(activityHours);
        setPauseAtActivity({
          name: currentOrPastActivity.name,
          position: pausePosition,
          startTime: currentOrPastActivity.time,
          nextStartTime: nextActualActivity?.time,
        });
      } else {
        setCurrentActivityName(null);
        setPauseAtActivity(null);
      }
    };

    updateState();
    const interval = setInterval(updateState, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [events, lastActivityTime]);

  // Calculate character position along timeline
  useEffect(() => {
    const calculatePosition = () => {
      const now = new Date();
      const wakeTime = 6;
      const sleepTime = 22;
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
    const interval = setInterval(calculatePosition, 10000); // Update every 10 seconds for smoother movement

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

      {/* Activity pause zone indicator */}
      {pauseAtActivity && (
        <div
          className="activity-pause-zone"
          style={{
            left: `calc(${pauseAtActivity.position}% - 60px)`,
          }}
        >
          <div className="pause-zone-line"></div>
        </div>
      )}

      {/* Character positioned along the timeline */}
      <div
        className={`character-container ${isWalking ? 'walking' : 'paused'}`}
        style={{
          left: `${characterPosition}%`,
          transition: isWalking ? 'left 1s ease-out' : 'left 10s linear',
        }}
      >
        <Character
          activityName={currentActivityName}
          isWalking={isWalking}
          isPaused={!isWalking && currentActivityName}
          animationSpeed={isWalking ? 'normal' : 'slow'}
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

      {/* Activity timeline dots */}
      {events.length > 0 && (
        <div className="activity-timeline">
          {events.map((event) => (
            <div
              key={event.id}
              className={`timeline-dot ${
                currentActivityName === event.name ? 'active' : ''
              }`}
              style={{
                left: `${hoursToPosition(timeToHours(event.time))}%`,
              }}
              title={`${event.name} at ${event.time}`}
            >
              <span className="dot-emoji">{event.emoji}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
