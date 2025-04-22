import { useState } from "preact/hooks";
import useTimes from "../../hooks/useTimes";
import dayjs from "dayjs";
import PrayerCalendar from "./PrayerCalender";

const PrayerTimeCalenderPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  //   const [city, setCity] = useState('Tokyo');
  const [city] = useState("Tokyo");

  //   const [country, setCountry] = useState('Japan');
  const [country] = useState("Japan");

  const [dayName, setDayName] = useState("Today");
  const { hijriDate } = useTimes(currentDate, { city, country });

  console.log(dayName, hijriDate);

  const handleDateSelect = (date: Date) => {
    setCurrentDate(dayjs(date));
    // Determine day name based on selected date
    const today = dayjs();
    if (today.isSame(date, "d")) {
      setDayName("Today");
    } else if (today.add(1, "day").isSame(date, "d")) {
      setDayName("Tomorrow");
    } else if (today.subtract(1, "day").isSame(date, "d")) {
      setDayName("Yesterday");
    } else {
      setDayName(dayjs(date).format("dddd"));
    }
  };

  return (
    <div className="flex flex-col bg-light rounded-lg">
      <main className="flex-1 px-4 pb-4 pt-2">
        <div>
          <div className="">
            <PrayerCalendar
              city={city}
              country={country}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrayerTimeCalenderPage;
