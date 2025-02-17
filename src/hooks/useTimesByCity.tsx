import axios from "axios";
import * as React from "react";
import { baseURL } from "../constants/constants";
import { PrayerTime } from "../types/types";
import { formatTime } from "../util/formatTime";

interface TimingsResponse {
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  };
}

const useTimesByCity = () => {
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTime[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await axios.get<TimingsResponse>(
          `${baseURL}/timingsByCity/15-02-2025?city=tokyo&country=JP`
        );

        const timings = response.data.data.timings;
        const formattedTimes: PrayerTime[] = [
          {
            name: "Fajr",
            time: formatTime(timings.Fajr),
            icon: "🌙",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Sunrise",
            time: formatTime(timings.Sunrise),
            icon: "☀️",
            completed: false,
            notificationEnabled: false,
          },
          {
            name: "Dhuhr",
            time: formatTime(timings.Dhuhr),
            icon: "☀️",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Asr",
            time: formatTime(timings.Asr),
            icon: "☀️",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Maghrib",
            time: formatTime(timings.Maghrib),
            icon: "🌅",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Isha",
            time: formatTime(timings.Isha),
            icon: "🌙",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Qiyam",
            time: "1:10 AM",
            icon: "🌙",
            completed: false,
            notificationEnabled: false,
          },
        ];

        setPrayerTimes(formattedTimes);
        setLoading(false);
      } catch (err) {
        setError("Error fetching prayer times");
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return { prayerTimes, loading, error };
};

export default useTimesByCity;
