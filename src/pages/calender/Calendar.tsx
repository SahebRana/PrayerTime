import { useState } from "preact/hooks";
import PrayerCalendar from "./PrayerCalender";

const PrayerTimeCalenderPage = () => {
  //   const [city, setCity] = useState('Tokyo');
  const [city] = useState("Tokyo");

  //   const [country, setCountry] = useState('Japan');
  const [country] = useState("Japan");



  const handleDateSelect = (date: Date) => {
    console.log("🚀 ~ handleDateSelect ~ date:", date)
    
  };

  return (
    <div className="flex flex-col bg-light rounded-lg">
      <main className="flex-1 px-4 pb-4">
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
