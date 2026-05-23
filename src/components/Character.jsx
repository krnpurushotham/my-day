import { useState, useEffect } from 'react';
import '../sprites.css';
import './Character.css';

export default function Character({
  currentActivity,
  isWalking = false,
  isPaused = false,
  animationSpeed = 'normal',
  activityName = null,
}) {
  const [spriteClass, setSpriteClass] = useState('sprite-idle');
  const [displayState, setDisplayState] = useState('idle'); // idle, walking, activity

  // Map activity names to sprite class names
  const activitySpriteMap = {
    'breakfast': 'sprite-breakfast',
    'lunch': 'sprite-lunch',
    'dinner': 'sprite-dinner',
    'bath': 'sprite-bath',
    'shower': 'sprite-bath',
    'bathing': 'sprite-bath',
    'school': 'sprite-school',
    'home': 'sprite-home',
    'music': 'sprite-music',
    'ball': 'sprite-ball',
    'sports': 'sprite-ball',
    'park': 'sprite-park',
    'read': 'sprite-read',
    'reading': 'sprite-read',
    'tv': 'sprite-tv',
    'watch': 'sprite-tv',
    'sleep': 'sprite-sleep',
    'sleeping': 'sprite-sleep',
  };

  // Determine which sprite to show based on state
  useEffect(() => {
    if (isWalking) {
      setSpriteClass('sprite-walk');
      setDisplayState('walking');
    } else if (activityName) {
      // Look for activity name in the map
      const activityLower = activityName.toLowerCase();
      
      let matchedSprite = null;
      // First try exact matches
      matchedSprite = activitySpriteMap[activityLower];
      
      // If no exact match, try partial matches
      if (!matchedSprite) {
        for (const [key, sprite] of Object.entries(activitySpriteMap)) {
          if (activityLower.includes(key) || key.includes(activityLower)) {
            matchedSprite = sprite;
            break;
          }
        }
      }
      
      setSpriteClass(matchedSprite || 'sprite-idle');
      setDisplayState('activity');
    } else {
      setSpriteClass('sprite-idle');
      setDisplayState('idle');
    }
  }, [activityName, isWalking]);

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
      {/* Speech bubble for activity hint */}
      {displayState === 'activity' && activityName && (
        <div className="activity-label">{activityName}</div>
      )}
    </div>
  );
}
