import * as React from "react";

interface ISettingsSectionProps {
  onSyncCalendar?: () => void;
  onJuristicMethodChange?: () => void;
  onCalculationMethodChange?: () => void;
}

const SettingsSection: React.FunctionComponent<ISettingsSectionProps> = ({
  onSyncCalendar,
  onJuristicMethodChange,
  onCalculationMethodChange,
}) => {
  return (
    <div className="mt-8 space-y-4">
      <button
        onClick={onSyncCalendar}
        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-black-primary">
            Sync with Google Calendar
          </h3>
          <p className="text-sm text-gray-600">
            Manage your Prayer times automatically
          </p>
        </div>
        <span className="text-gray-400">›</span>
      </button>

      <button
        onClick={onJuristicMethodChange}
        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-black-primary">Juristic Method</h3>
          <p className="text-sm text-gray-600">Shafi/Maliki/Hanbali</p>
        </div>
        <span className="text-gray-400">›</span>
      </button>

      <button
        onClick={onCalculationMethodChange}
        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-black-primary">
            Calculation Method
          </h3>
          <p className="text-sm text-gray-600">MWL</p>
        </div>
        <span className="text-gray-400">›</span>
      </button>
    </div>
  );
};

export default SettingsSection;
