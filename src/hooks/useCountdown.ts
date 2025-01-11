import { useState, useEffect } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
}

export const useCountdown = (targetDate: Date): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};