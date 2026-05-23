import { useState, useEffect } from 'react';
import '../sprites.css';
import './Character.css';

export default function Character({
  currentActivity = null,
  isWalking = false,
  isPaused = false,
  animationSpeed = 'normal',
  activityName = null,
}) {
  const [spriteClass, setSpriteClass] = useState('sprite-idle');
  const [displayState, setDisplayState] = useState('idle');

  // Map activity names and emoji to sprite class names
  const activitySpriteMap = {
    // Breakfast/eating related
    'breakfast': 'sprite-breakfast',
    'eat': 'sprite-breakfast',
    'eating': 'sprite-breakfast',
    '🍽️': 'sprite-breakfast',

    // Lunch/eating related
    'lunch': 'sprite-lunch',

    // Dinner/eating related
    'dinner': 'sprite-dinner',

    // Bath/shower
    'bath': 'sprite-bath',
    'shower': 'sprite-bath',
    'bathing': 'sprite-bath',
    '🚿': 'sprite-bath',

    // School/education
    'school': 'sprite-school',
    'study': 'sprite-school',
    '🏫': 'sprite-school',

    // Home
    'home': 'sprite-home',
    '🏠': 'sprite-home',

    // Music
    'music': 'sprite-music',
    'play music': 'sprite-music',
    '🎵': 'sprite-music',

    // Ball/sports
    'ball': 'sprite-ball',
    'sports': 'sprite-ball',
    'play': 'sprite-ball',
    '⚽': 'sprite-ball',

    // Park
    'park': 'sprite-park',

    // Reading
    'read': 'sprite-read',
    'reading': 'sprite-read',
    '📚': 'sprite-read',

    // TV/watch
    'tv': 'sprite-tv',
    'watch': 'sprite-tv',
    '📺': 'sprite-tv',

    // Sleep
    'sleep': 'sprite-sleep',
    'sleeping': 'sprite-sleep',
    'bed': 'sprite-sleep',
    '😴': 'sprite-sleep',
  };

  // Determine which sprite to show
  useEffect(() => {
    if (isWalking) {
      setSpriteClass('sprite-walk');
      setDisplayState('walking');
    } else if (activityName) {
      const activityLower = activityName.toLowerCase();
      
      // Try exact match first
      let matchedSprite = activitySpriteMap[activityLower];
      
      // Try partial matches if no exact match
      if (!matchedSprite) {
        for (const [key, sprite] of Object.entries(activitySpriteMap)) {
          if (activityLower.includes(key) || key.includes(activityLower)) {
            matchedSprite = sprite;
            break;
          }
        }
      }

      // Also check if the activity name contains an emoji
      if (!matchedSprite) {
        for (const [emoji, sprite] of Object.entries(activitySpriteMap)) {
          if (emoji.length > 1 && emoji.match(/\p{Emoji}/u) && activityName.includes(emoji)) {
            matchedSprite = sprite;
            break;
          }
        }
      }
      
      setSpriteClass(matchedSprite || 'sprite-idle');
      setDisplayState(isPaused ? 'activity' : 'transition');
    } else {
      setSpriteClass('sprite-idle');
      setDisplayState('idle');
    }
  }, [activityName, isWalking, isPaused]);

  // Build class string with modifiers
  let classes = `sprite ${spriteClass}`;
  if (isPaused) classes += ' paused';
  if (animationSpeed === 'slow') classes += ' slow-motion';
  if (animationSpeed === 'fast') classes += ' fast-forward';
  
  // Add state class for styling
  classes += ` state-${displayState}`;

  return (
    <div className="character-wrapper">
      <div className={classes}></div>
      {/* Activity label for context */}
      {displayState === 'activity' && activityName && (
        <div className="activity-label">{activityName}</div>
      )}
    </div>
  );
}
