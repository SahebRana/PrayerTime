import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { Bell, BellOff } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

          </div>

          <div className="space-y-4">
            {prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("completedPrayers")}
                    value={prayer.name}
                    className="hidden"
                    id={`completed-${prayer.name}`}
                  />
                  <label
                    htmlFor={`completed-${prayer.name}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer
                      ${
                        completedPrayers?.includes(prayer.name)
                          ? "bg-blue-600 text-white"
                          : "border-2 border-gray-300"
                      }`}
                  >
                    {completedPrayers?.includes(prayer.name) && "✓"}
                  </label>
                  <span className="font-medium">{prayer.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{prayer.time}</span>
                  <input
                    type="checkbox"
                    {...register("notifications")}
                    value={prayer.name}
                    className="hidden"
                    id={`notification-${prayer.name}`}
                  />
                  <label
                    htmlFor={`notification-${prayer.name}`}
                    className="cursor-pointer"
                  >
                    {notifications?.includes(prayer.name) ? (
                      <Bell className="w-5 h-5 text-blue-600" />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
};

export default PrayerTimesPage;
