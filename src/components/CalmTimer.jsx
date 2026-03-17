import { useState, useEffect } from 'react';

export default function CalmTimer({ isPlaying, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  useEffect(() => {
    let interval = null;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onExpire();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, onExpire]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return <div className="calm-time">{formatTime(timeLeft)}</div>;
}
