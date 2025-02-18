import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { PrayerTime } from "../../types/types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// Initialize the duration plugin
dayjs.extend(duration);

interface PrayerTimerProps {
  prayerTimes: PrayerTime[];
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ prayerTimes }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Find next prayer time
  useEffect(() => {
    if (!prayerTimes?.length) return;

    const findNextPrayer = () => {
      const now = dayjs();

      // Convert prayer times to dayjs objects for today
      const todaysPrayers = prayerTimes.map((prayer) => ({
        ...prayer,
        datetime: dayjs(
          `${now.format("YYYY-MM-DD")} ${prayer.time}`,
          "YYYY-MM-DD h:mm A"
        ),
      }));

      // Find the next prayer
      const next = todaysPrayers.find((prayer) => prayer.datetime.isAfter(now));

      // If no prayer found for today, get the first prayer for tomorrow
      if (!next && todaysPrayers.length > 0) {
        const tomorrow = now.add(1, "day");
        const firstPrayer = {
          ...todaysPrayers[0],
          datetime: dayjs(
            `${tomorrow.format("YYYY-MM-DD")} ${todaysPrayers[0].time}`,
            "YYYY-MM-DD h:mm A"
          ),
        };
        setNextPrayer(firstPrayer);
      } else {
        setNextPrayer(next || null);
      }
    };

    findNextPrayer();
    const interval = setInterval(findNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, currentTime]);

  // Format time to HH:MM AM/PM
  const formatTime = (date: Date) => {
    return dayjs(date).format("h:mm A");
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!nextPrayer) return "00:00";

    const diff = nextPrayer.datetime.diff(dayjs());
    const duration = dayjs.duration(diff);

    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes() % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  if (!nextPrayer) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-500">Now</span>
        <span className="text-lg font-semibold">{formatTime(currentTime)}</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Clock className="w-16 h-16 text-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{getTimeRemaining()}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">Until</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-500">{nextPrayer.name}</span>
        <span className="text-lg font-semibold">{nextPrayer.time}</span>
      </div>
    </div>
  );
};

export default PrayerTimer;
