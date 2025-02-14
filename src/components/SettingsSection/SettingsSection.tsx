import * as React from "react";

interface ISettingsSectionProps {}

const SettingsSection: React.FunctionComponent<ISettingsSectionProps> = (

) => {
  return (
    <>
      {" "}
      {/* Settings Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Sync with Google Calendar</h3>
            <p className="text-sm text-gray-600">
              Manage your Prayer times automatically
            </p>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Juristic Method</h3>
            <p className="text-sm text-gray-600">Shafi/Maliki/Hanbali</p>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Calculation Method</h3>
            <p className="text-sm text-gray-600">MWL</p>
          </div>
          <span className="text-gray-400">›</span>
        </div>
      </div>
    </>
  );
};

export default SettingsSection;
