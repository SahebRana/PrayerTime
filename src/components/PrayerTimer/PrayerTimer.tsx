import { useState, useEffect } from "react";
import { PrayerTime } from "../../types/types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import useNextPrayerStore from "../../store/useNextPrayerStore";

// Initialize the duration plugin
dayjs.extend(duration);

interface PrayerTimerProps {
  prayerTimes: PrayerTime[];
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ prayerTimes }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const { setNextPrayerTime } = useNextPrayerStore();

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
          "YYYY-MM-DD hh:mm A"
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
            "YYYY-MM-DD hh:mm A"
          ),
        };
        setNextPrayer(firstPrayer);
        setNextPrayerTime(firstPrayer);
      } else {
        setNextPrayer(next || null);
        setNextPrayerTime(next || null);
      }
    };

    findNextPrayer();
    const interval = setInterval(findNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, currentTime]);

  // Format time to HH:MM AM/PM
  const formatTime = (date: Date) => {
    return dayjs(date).format("hh:mm A");
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.datetime) return "00:00";

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
    <div className="flex items-center justify-between w-full max-w-md py-2 px-4 bg-primary rounded-lg shadow">
      <div className="flex flex-col items-center leading-0">
        <span className="text-lg font-semibold leading-4">{formatTime(currentTime)}</span>
        <span className="text-sm text-black-secondary">Now</span>
      </div>
      <div className="flex flex-col items-center justify-center w-18 h-18 aspect-square rounded-full border-3 border-border-color">
        <span className="text-base font-medium leading-4">{getTimeRemaining()}</span>
        <span className="text-xs text-black-secondary">After</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold leading-4">{nextPrayer.time}</span>
        <span className="text-sm text-black-secondary">{nextPrayer.name}</span>
      </div>
    </div>
  );
};

export default PrayerTimer;
