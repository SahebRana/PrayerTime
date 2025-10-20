import axios from "axios";
import * as React from "react";
import { baseURL } from "../constants/constants";
import { PrayerTime } from "../types/types";
import { formatTime } from "../util/formatTime";
import { SingleDateDto } from "../models/single-day-dto";
import dayjs from 'dayjs';

const useTimes = (date: any, params: any) => {
  const { city, country } = params;
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseURL}/timingsByCity/${dayjs(date).format('DD-MM-YYYY')}?${queryString}`
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTime[]>([]);
  const [hijriDate, setHijriDate] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Only fetch if we have both city and country
        if (!city || !country) {
          setError("City and country are required");
          setLoading(false);
          return;
        }

        console.log(`Fetching prayer times for ${city}, ${country} on ${dayjs(date).format('DD-MM-YYYY')}`);
        
        const response = await axios.get<SingleDateDto>(url);

        const timings = response.data.data.timings;
        const getFormatTime = formatTime(date);
        const formattedTimes: PrayerTime[] = [
          {
            name: "Fajr",
            time: getFormatTime(timings.Fajr),
            icon: "🌙",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Sunrise",
            time: getFormatTime(timings.Sunrise),
            icon: "☀️",
            completed: false,
            notificationEnabled: false,
          },
          {
            name: "Dhuhr",
            time: getFormatTime(timings.Dhuhr),
            icon: "☀️",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Asr",
            time: getFormatTime(timings.Asr),
            icon: "☀️",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Maghrib",
            time: getFormatTime(timings.Maghrib),
            icon: "🌅",
            completed: false,
            notificationEnabled: true,
          },
          {
            name: "Isha",
            time: getFormatTime(timings.Isha),
            icon: "🌙",
            completed: false,
            notificationEnabled: true,
          },
        ];
        setPrayerTimes(formattedTimes);
        const hijri = response.data.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Error fetching prayer times");
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [date, city, country, url]); // Include city and country in dependencies

  return { prayerTimes, hijriDate, loading, error };
};

export default useTimes;
