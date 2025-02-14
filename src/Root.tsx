import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

interface IRootElementProps {}

const RootElement: React.FunctionComponent<IRootElementProps> = () => {
  return (
    <div className="root-layout w-96 mx-auto border min-h-screen p-4 flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto py-4">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default RootElement;
