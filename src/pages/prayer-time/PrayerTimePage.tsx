import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PrayerCard from "../../components/PrayerCard/PrayedCard";
import { useForm } from "react-hook-form";
import { PrayerFormData } from "../../types/types";
import useTimes from "../../hooks/useTimes";
import PrayerTimer from "../../components/PrayerTimer/PrayerTimer";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocationStore } from "../../store/useLocationStore";

const PrayerTimesPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { selectedCountry, selectedCity, loadSelectedLocation, detectLocation } = useLocationStore();

  // Get city and country with localStorage -> store -> auto -> default fallback priority
  const [cityName, setCityName] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");

  // Initialize city and country from localStorage or store or defaults
  useEffect(() => {
    // First try to get from localStorage directly
    const storedCity = localStorage.getItem("selectedCity");
    const storedCountry = localStorage.getItem("selectedCountry");

    let cityValue = "";
    let countryValue = "";

    // Parse from localStorage if available
    if (storedCity) {
      try {
        const cityData = JSON.parse(storedCity);
        cityValue = cityData.name;
      } catch (e) {
        console.error("Error parsing stored city:", e);
      }
    }

    if (storedCountry) {
      try {
        const countryData = JSON.parse(storedCountry);
        countryValue = countryData.name;
      } catch (e) {
        console.error("Error parsing stored country:", e);
      }
    }

    // If not found in localStorage, use store values
    if ((!cityValue) || (!countryValue)) {
      detectLocation().then(data => {
        console.log(data);
        setCityName(data.selectedCity.name || "Dhaka");
        setCountryName(data.selectedCountry.name || "Bangladesh");
      });
    }
    else {
      // Default fallbacks if nothing else available
      setCityName(cityValue || "Dhaka");
      setCountryName(countryValue || "Bangladesh");
    }
  }, []);

  const [dayName, setDayName] = useState("");

  const { prayerTimes, hijriDate, loading } = useTimes(currentDate, {
    city: cityName,
    country: countryName,
  });

  // Load the selected location when the component mounts
  useEffect(() => {
    loadSelectedLocation();
  }, []);

  // Reset if location updated
  useEffect(() => {
    if (selectedCity?.name && selectedCountry?.name) {
      setCityName(selectedCity.name);
      setCountryName(selectedCountry.name);
    }
  }, [selectedCity, selectedCountry]);

  const { register, handleSubmit, watch } = useForm<PrayerFormData>({
    defaultValues: {
      completedPrayers:
        prayerTimes
          ?.filter((prayer) => prayer.completed)
          .map((prayer) => prayer.name) || [],
      notifications:
        prayerTimes
          ?.filter((prayer) => prayer.notificationEnabled)
          .map((prayer) => prayer.name) || [],
    },
  });

  const completedPrayers = watch("completedPrayers");
  const notifications = watch("notifications");

  useEffect(() => {
    handleSubmit(onSubmit)();
  }, [completedPrayers, notifications]);

  const onSubmit = (data: PrayerFormData) => {
  };

  const addDay = () => {
    setCurrentDate(currentDate.add(1, "day"));
  };

  const subtractDay = () => {
    setCurrentDate(currentDate.subtract(1, "day"));
  };

  useEffect(() => {
    const today = dayjs();
    if (today.isSame(currentDate, "d")) {
      setDayName("Today");
    } else if (today.isSame(currentDate.add(1, "day"), "d")) {
      setDayName("Yesterday");
    } else if (today.isSame(currentDate.subtract(1, "day"), "d")) {
      setDayName("Tomorrow");
    } else {
      setDayName(currentDate.format("dddd"));
    }
  }, [currentDate]);

  return (
    <div className="flex flex-col bg-light rounded-lg">
      <main className="flex-1 px-4 pb-4">
        <div>
          <div className="my-4 flex items-center justify-between">
            <button onClick={subtractDay}>
              <FaChevronLeft color="#1f2328" />
            </button>

            <div className="text-lg font-semibold mb-2 text-center">
              <p className={"text-black-primary text-sm"}>{dayName}</p>
              <p className={"text-xs text-black-secondary capitalize"}>
                {cityName}, {currentDate.format("DD MMM YYYY")}, {hijriDate}
              </p>
            </div>

            <button onClick={addDay}>
              <FaChevronRight color="#1f2328" />
            </button>
          </div>

          <div className="overview mb-4">
            <PrayerTimer prayerTimes={prayerTimes} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          ) : (
            <div className="prayer-list space-y-3">
              {prayerTimes.map((prayer) => (
                <PrayerCard
                  key={prayer.name}
                  prayer={prayer}
                  register={register}
                  completedPrayers={completedPrayers}
                  notifications={notifications}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PrayerTimesPage;
