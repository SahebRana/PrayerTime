import * as React from "react";
import { Bell, BellOff } from "lucide-react";
import { IPrayerCardProps } from "../../types/types";

const PrayerCard: React.FunctionComponent<IPrayerCardProps> = ({
  prayer,
  register,
  completedPrayers,
  notifications
}) => {
  return (
    <>
      <div
        key={prayer.name}
        className="flex items-center justify-between p-3 bg-[#DFF2E0] rounded-lg"
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
    </>
  );
};

export default PrayerCard;
