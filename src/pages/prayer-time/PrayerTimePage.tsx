import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PrayerCard from "../../components/PrayerCard/PrayedCard";
import { useForm } from "react-hook-form";
import { PrayerFormData } from "../../types/types";
import useTimes from "../../hooks/useTimes";
import PrayerTimer from "../../components/PrayerTimer/PrayerTimer";
import { useEffect } from "react";

const PrayerTimesPage = () => {
  const { prayerTimes, loading } = useTimes();

  const { register, handleSubmit, watch } = useForm<PrayerFormData>({
    defaultValues: {
      completedPrayers: prayerTimes
        ?.filter((prayer) => prayer.completed)
        .map((prayer) => prayer.name) || [],
      notifications: prayerTimes
        ?.filter((prayer) => prayer.notificationEnabled)
        .map((prayer) => prayer.name) || [],
    },
  });

  const completedPrayers = watch("completedPrayers");
  const notifications = watch("notifications");

  // Watch for changes and submit immediately
  useEffect(() => {
    handleSubmit(onSubmit)();
  }, [completedPrayers, notifications]);

  const onSubmit = (data: PrayerFormData) => {
    console.log("Form submitted:", data);
    // Handle form submission here
  };

  return (
    <div className="flex flex-col bg-light rounded-lg">
      <main className="flex-1 px-4 pb-4">
        <form>
          <div className="my-4 flex items-center justify-between">
            <FaChevronLeft color="#343434" />

            <div className="text-lg font-semibold mb-2 text-center">
              <p className={"text-black-primary text-sm"}>Today</p>
              <p className={"text-xs text-black-secondary"}>
                Tokyo, 15 Feb 2025, 16 Shaban 1446
              </p>
            </div>

            <FaChevronRight color="#343434" />
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
        </form>
      </main>
    </div>
  );
};

export default PrayerTimesPage;
