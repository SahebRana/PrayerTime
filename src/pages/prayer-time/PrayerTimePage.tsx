import { useState } from "preact/hooks";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PrayerCard from "../../components/PrayerCard/PrayedCard";
import { useForm } from "react-hook-form";

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  completed: boolean;
  notificationEnabled: boolean;
}

interface PrayerFormData {
  completedPrayers: string[];
  notifications: string[];
}

const PrayerTimesPage = () => {
  const [prayerTimes] = useState<PrayerTime[]>([
    {
      name: "Fajr",
      time: "05:05 AM",
      icon: "🌙",
      completed: true,
      notificationEnabled: true,
    },
    {
      name: "Sunrise",
      time: "06:31 AM",
      icon: "☀️",
      completed: false,
      notificationEnabled: false,
    },
    {
      name: "Dhuhr",
      time: "11:55 AM",
      icon: "☀️",
      completed: true,
      notificationEnabled: true,
    },
    {
      name: "Asr",
      time: "02:56 PM",
      icon: "☀️",
      completed: false,
      notificationEnabled: true,
    },
    {
      name: "Maghrib",
      time: "05:20 PM",
      icon: "🌅",
      completed: false,
      notificationEnabled: true,
    },
    {
      name: "Isha",
      time: "06:41 PM",
      icon: "🌙",
      completed: false,
      notificationEnabled: true,
    },
    {
      name: "Qiyam",
      time: "01:10 AM",
      icon: "🌙",
      completed: false,
      notificationEnabled: false,
    },
  ]);

  const { register, handleSubmit, watch } = useForm<PrayerFormData>({
    defaultValues: {
      completedPrayers: prayerTimes
        .filter((prayer) => prayer.completed)
        .map((prayer) => prayer.name),
      notifications: prayerTimes
        .filter((prayer) => prayer.notificationEnabled)
        .map((prayer) => prayer.name),
    },
  });

  const completedPrayers = watch("completedPrayers");
  const notifications = watch("notifications");

  const onSubmit = (data: PrayerFormData) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="flex flex-col bg-[#F5F5F5] rounded-lg">
      <main className="flex-1 px-4">
        <form onChange={handleSubmit(onSubmit)}>
          <div className="my-4 flex items-center justify-between">
            <FaChevronLeft color="#343434" />

            <div className="text-lg font-semibold mb-2 text-center">
              <p className={"text-[#343434] text-sm"}>Today</p>
              <p className={"text-xs text-[#757575]"}>
                Tokyo, 15 Feb 2025, 16 Shaban 1446
              </p>
            </div>

            <FaChevronRight color="#343434" />
          </div>

          <div className="overview bg-white rounded-lg mb-4 py-10">
            {/* overview here */}
          </div>

          <div className="space-y-4">
            {/* card here */}
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
        </form>
      </main>
    </div>
  );
};

export default PrayerTimesPage;
