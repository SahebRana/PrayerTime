import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import PrayerTimesPage from "./pages/prayer-time/PrayerTimePage";
// import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

interface IRootElementProps {}

const RootElement: React.FunctionComponent<IRootElementProps> = () => {
  return (
    <div className="root-layout w-96 mx-auto min-h-screen p-4 flex flex-col">
      <Header />
      <PrayerTimesPage />
      <Outlet />

      {/* <BottomNavigation /> */}
    </div>
  );
};

export default RootElement;
