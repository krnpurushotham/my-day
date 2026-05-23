import { useState, useEffect } from 'react';
import Character from './Character';
import ReplayButton from './ReplayButton';
import ReplayOverlay from './ReplayOverlay';
import './TrackVisualization.css';

export default function TrackVisualization({ events }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentActivityName, setCurrentActivityName] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [pauseAtActivity, setPauseAtActivity] = useState(null);
  const [lastActivityTime, setLastActivityTime] = useState(null);

  // Replay state
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [replayActivityName, setReplayActivityName] = useState(null);
  const [replayPosition, setReplayPosition] = useState(0);

  // Helper: Convert time string to hours decimal
  const timeToHours = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Helper: Convert hours decimal to timeline position
  const hoursToPosition = (hours) => {
    const wakeTime = 6;
    const sleepTime = 22;
    const totalHours = sleepTime - wakeTime;

    if (hours < wakeTime) return 0;
    if (hours > sleepTime) return 100;

    const position = ((hours - wakeTime) / totalHours) * 100;
    return Math.max(0, Math.min(100, position));
  };

  // Update normal time and activity tracking
  useEffect(() => {
    if (isReplaying) return; // Skip during replay

    const updateState = () => {
      const now = new Date();
      setCurrentTime(now);

      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      const sortedEvents = events.sort((a, b) => b.time.localeCompare(a.time));
      const currentOrPastActivity = sortedEvents.find(e => e.time <= currentTimeStr);

      if (currentOrPastActivity) {
        setCurrentActivityName(currentOrPastActivity.name);

        if (lastActivityTime !== currentOrPastActivity.time) {
          setLastActivityTime(currentOrPastActivity.time);
          setIsWalking(true);
          setTimeout(() => setIsWalking(false), 1200);
        }

        const activityHours = timeToHours(currentOrPastActivity.time);
        setPauseAtActivity({
          name: currentOrPastActivity.name,
          position: hoursToPosition(activityHours),
          startTime: currentOrPastActivity.time,
        });
      } else {
        setCurrentActivityName(null);
        setPauseAtActivity(null);
      }
    };

    updateState();
    const interval = setInterval(updateState, 30000);
    return () => clearInterval(interval);
  }, [events, lastActivityTime, isReplaying]);

  // Update normal character position
  useEffect(() => {
    if (isReplaying) return; // Skip during replay

    const calculatePosition = () => {
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const position = hoursToPosition(currentHour);
      setCharacterPosition(position);
    };

    calculatePosition();
    const interval = setInterval(calculatePosition, 10000);
    return () => clearInterval(interval);
  }, [isReplaying]);

  // Replay animation logic
  useEffect(() => {
    if (!isReplaying) return;

    const startTime = Date.now();
    const sortedEvents = events.sort((a, b) => a.time.localeCompare(b.time));
    const eventDuration = 2500; // 2.5 seconds per activity
    const totalDuration = sortedEvents.length * eventDuration;

    const animateReplay = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 1000, sortedEvents.length * 2.5); // Convert to seconds

      setReplayProgress(progress);

      // Calculate which activity is current
      const currentEventIndex = Math.floor((elapsed / eventDuration) % sortedEvents.length);
      if (currentEventIndex < sortedEvents.length) {
        const event = sortedEvents[currentEventIndex];
        setReplayActivityName(event.name);

        // Calculate position for this activity
        const activityHours = timeToHours(event.time);
        setReplayPosition(hoursToPosition(activityHours));
      }

      // Check if replay is complete
      if (elapsed >= totalDuration) {
        setIsReplaying(false);
        setReplayProgress(0);
        setReplayActivityName(null);
      } else {
        requestAnimationFrame(animateReplay);
      }
    };

    const frameId = requestAnimationFrame(animateReplay);
    return () => cancelAnimationFrame(frameId);
  }, [isReplaying, events]);

  const handleReplayStart = () => {
    if (events.length === 0) return;
    setIsReplaying(true);
    setReplayProgress(0);
  };

  const handleReplayComplete = () => {
    setIsReplaying(false);
    setReplayProgress(0);
    setReplayActivityName(null);
  };

  // Use replay data if replaying, otherwise use normal data
  const displayPosition = isReplaying ? replayPosition : characterPosition;
  const displayActivity = isReplaying ? replayActivityName : currentActivityName;
  const displayIsWalking = isReplaying ? false : isWalking;

  return (
    <div className={`track-visualization ${isReplaying ? 'replay-mode' : ''}`}>
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

      {/* Timeline labels */}
      <div className="timeline-labels">
        <span className="label-time">6 AM</span>
        <span className="label-time">9 AM</span>
        <span className="label-time">12 PM</span>
        <span className="label-time">3 PM</span>
        <span className="label-time">6 PM</span>
        <span className="label-time">9 PM</span>
      </div>

      {/* Activity pause zone */}
      {pauseAtActivity && !isReplaying && (
        <div
          className="activity-pause-zone"
          style={{
            left: `calc(${pauseAtActivity.position}% - 60px)`,
          }}
        >
          <div className="pause-zone-line"></div>
        </div>
      )}

      {/* Character positioned along timeline */}
      <div
        className={`character-container ${displayIsWalking ? 'walking' : 'paused'}`}
        style={{
          left: `${displayPosition}%`,
          transition: displayIsWalking ? 'left 1s ease-out' : 'left 0.3s ease',
        }}
      >
        <Character
          activityName={displayActivity}
          isWalking={displayIsWalking}
          isPaused={!displayIsWalking && displayActivity}
          animationSpeed={displayIsWalking ? 'normal' : 'slow'}
        />
      </div>

      {/* Time indicator */}
      {!isReplaying && (
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
      )}

      {/* Progress bar */}
      <div className="day-progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${displayPosition}%` }}
        ></div>
      </div>

      {/* Activity timeline dots */}
      {events.length > 0 && (
        <div className="activity-timeline">
          {events.map((event) => (
            <div
              key={event.id}
              className={`timeline-dot ${
                currentActivityName === event.name && !isReplaying ? 'active' : ''
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

      {/* Replay button */}
      <ReplayButton
        onClick={handleReplayStart}
        isReplaying={isReplaying}
        disabled={events.length === 0}
      />

      {/* Replay overlay */}
      <ReplayOverlay
        events={events}
        isReplaying={isReplaying}
        onReplayComplete={handleReplayComplete}
        replayProgress={replayProgress}
      />
    </div>
  );
}
