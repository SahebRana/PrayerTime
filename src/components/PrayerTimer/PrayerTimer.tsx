import { useState, useEffect } from "react";
import { PrayerTime } from "../../types/types";
import dayjs from "dayjs";
import useNextPrayerStore from "../../store/useNextPrayerStore";

interface PrayerTimerProps {
  prayerTimes: PrayerTime[];
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ prayerTimes }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const { setNextPrayerTime } = useNextPrayerStore();

  // Helper function to parse time string (e.g., "05:30 AM") to Date object
  const parseTimeToDate = (
    timeStr: string,
    baseDate: Date = new Date()
  ): Date => {
    const [time, period] = timeStr.trim().split(" ");
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes,
      0,
      0
    );
  };

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
      const now = new Date();

      // Convert prayer times to Date objects for today
      const todaysPrayers = prayerTimes.map((prayer) => ({
        ...prayer,
        datetime: dayjs(parseTimeToDate(prayer.time, now)),
      }));

      // Find the next prayer
      const next = todaysPrayers.find(
        (prayer) => prayer.datetime.toDate() > now
      );

      // If no prayer found for today, get the first prayer for tomorrow
      if (!next && todaysPrayers.length > 0) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const firstPrayer = {
          ...todaysPrayers[0],
          datetime: dayjs(parseTimeToDate(todaysPrayers[0].time, tomorrow)),
        };
        setNextPrayer(firstPrayer);
        setNextPrayerTime(firstPrayer);
      } else {
        setNextPrayer(next || null);
        setNextPrayerTime(next || null);
      }
    };

    findNextPrayer();
    const interval = setInterval(findNextPrayer, 60000); // Check every minute instead of every second

    return () => clearInterval(interval);
  }, [prayerTimes, setNextPrayerTime]);

  // Format time to HH:MM AM/PM
  const formatTime = (date: Date) => {
    return dayjs(date).format("hh:mm A");
  };

  // Calculate time remaining using native Date
  const getTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.datetime) return "00:00";

    const now = new Date();
    const nextTime = nextPrayer.datetime.toDate();

    // Calculate difference in milliseconds
    const diff = nextTime.getTime() - now.getTime();

    // If time has passed, return 00:00
    if (diff <= 0) return "00:00";

    // Calculate hours and minutes
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  if (!nextPrayer) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md py-2 px-4 bg-primary rounded-lg shadow">
      <div className="flex flex-col items-center leading-0">
        <span className="text-lg font-semibold leading-4">
          {formatTime(currentTime)}
        </span>
        <span className="text-sm text-black-secondary">Now</span>
      </div>

      <div className="flex flex-col items-center justify-center w-18 h-18 aspect-square rounded-full border-3 border-border-color">
        <span className="text-base font-medium leading-4">
          {getTimeRemaining()}
        </span>
        <span className="text-xs text-black-secondary">After</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold leading-4">
          {nextPrayer.time}
        </span>
        <span className="text-sm text-black-secondary">{nextPrayer.name}</span>
      </div>
    </div>
  );
};

export default PrayerTimer;
