import * as React from "react";
import { IPrayerCardProps } from "../../types/types";

const PrayerCard: React.FunctionComponent<IPrayerCardProps> = ({
  prayer,
  register,
  completedPrayers,
}) => {
  const { onChange, ...rest } = register("completedPrayers");

  const handleCardClick = () => {
    const checkboxElement = document.getElementById(`completed-${prayer.name}`) as HTMLInputElement;
    if (checkboxElement) {
      checkboxElement.checked = !checkboxElement.checked;
      onChange({
        target: checkboxElement,
        type: 'change',
      });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between p-3 bg-[#DFF2E0] hover:bg-[#CACDF1] rounded-lg cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...rest}
          onChange={onChange}
          value={prayer.name}
          className="hidden"
          id={`completed-${prayer.name}`}
        />
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center
            ${
              completedPrayers?.includes(prayer.name)
                ? "bg-blue-600 text-white"
                : "border-2 border-gray-300"
            }`}
        >
          {completedPrayers?.includes(prayer.name) && "✓"}
        </div>
        <span className="font-semibold">{prayer.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold">{prayer.time}</span>
      </div>
    </div>
  );
};

export default PrayerCard;
