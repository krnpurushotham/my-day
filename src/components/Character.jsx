import { useState, useEffect } from 'react';
import '../sprites.css';

export default function Character({ currentActivity, isWalking, isPaused, animationSpeed = 'normal' }) {
  const [spriteClass, setSpriteClass] = useState('sprite-idle');

  // Map activity names to sprite class names
  const activitySpriteMap = {
    'breakfast': 'sprite-breakfast',
    'lunch': 'sprite-lunch',
    'dinner': 'sprite-dinner',
    'bath': 'sprite-bath',
    'school': 'sprite-school',
    'home': 'sprite-home',
    'music': 'sprite-music',
    'ball': 'sprite-ball',
    'park': 'sprite-park',
    'read': 'sprite-read',
    'tv': 'sprite-tv',
    'sleep': 'sprite-sleep',
  };

  // Determine which sprite to show
  useEffect(() => {
    if (isWalking) {
      setSpriteClass('sprite-walk');
    } else if (currentActivity) {
      // Extract activity name from emoji+name format or use as-is
      const activityName = currentActivity.toLowerCase();
      const matchedSprite = Object.entries(activitySpriteMap).find(([key]) =>
        activityName.includes(key) || key.includes(activityName)
      )?.[1];
      setSpriteClass(matchedSprite || 'sprite-idle');
    } else {
      setSpriteClass('sprite-idle');
    }
  }, [currentActivity, isWalking]);

  // Build class string with modifiers
  let classes = `sprite ${spriteClass}`;
  if (isPaused) classes += ' paused';
  if (animationSpeed === 'slow') classes += ' slow-motion';
  if (animationSpeed === 'fast') classes += ' fast-forward';

  return <div className={classes}></div>;
}
