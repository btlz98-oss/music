import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  initialMinutes?: number;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Simple notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("시간 종료!", { body: "활동 시간이 끝났습니다." });
      } else {
        alert("⏰ 시간이 종료되었습니다!");
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-2 py-1 print:hidden">
      <TimerIcon size={14} className="text-stone-500" />
      <span className={`font-mono font-bold text-sm ${timeLeft < 30 && isActive ? 'text-red-600 animate-pulse' : 'text-stone-700'}`}>
        {formatTime(timeLeft)}
      </span>
      <button onClick={toggleTimer} className="p-1 hover:bg-stone-200 rounded text-stone-600">
        {isActive ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <button onClick={resetTimer} className="p-1 hover:bg-stone-200 rounded text-stone-600">
        <RotateCcw size={12} />
      </button>
    </div>
  );
};