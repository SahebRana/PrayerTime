import * as React from "react";
import { IPrayerCardProps } from "../../types/types";
import { Sun, Moon } from "lucide-react";
import useNextPrayerStore from "../../store/useNextPrayerStore";

const PrayerCard: React.FunctionComponent<IPrayerCardProps> = ({
  prayer,
  register,
  completedPrayers,
}) => {
  const { onChange, ...rest } = register("completedPrayers");
  const { nextPrayerTime } = useNextPrayerStore();

  const getBackgroundColor = () => {
    if (nextPrayerTime?.name === prayer.name) {
      return "bg-blue-secondary";
    }
    return "bg-green-secondary";
  };

  const handleCardClick = () => {
    if (prayer.name !== "Sunrise" && prayer.name !== "Qiyam") {
      const checkboxElement = document.getElementById(
        `completed-${prayer.name}`
      ) as HTMLInputElement;
      if (checkboxElement) {
        checkboxElement.checked = !checkboxElement.checked;
        onChange({
          target: checkboxElement,
          type: "change",
        });
      }
    }
  };

  const renderIcon = () => {
    switch (prayer.name) {
      case "Sunrise":
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case "Qiyam":
        return <Moon className="w-6 h-6 text-blue-500" />;
      default:
        return (
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center
              ${
                completedPrayers?.includes(prayer.name)
                  ? "text-black-primary border-2 border-black-primary"
                  : "border-2 border-black-primary"
              }`}
          >
            {completedPrayers?.includes(prayer.name) && "✓"}
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${getBackgroundColor()}`}
    >
      <div className="flex items-center gap-3">
        {prayer.name !== "Sunrise" && prayer.name !== "Qiyam" && (
          <input
            type="checkbox"
            {...rest}
            onChange={onChange}
            value={prayer.name}
            className="hidden"
            id={`completed-${prayer.name}`}
          />
        )}
        {renderIcon()}
        <span className="font-semibold">{prayer.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold">{prayer.time}</span>
      </div>
    </div>
  );
};

export default PrayerCard;
