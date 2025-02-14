import { Book, Calendar, Heart, Home } from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router-dom";

interface IBottomNavigationProps {}

const BottomNavigation: React.FunctionComponent<
  IBottomNavigationProps
> = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center ${
      isActive ? "text-blue-600" : "text-gray-400"
    }`;

  return (
    <nav className="border-t bg-white">
      <div className="flex justify-around p-4">
        <NavLink to="/home" className={getLinkClass}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/prayer-time" className={getLinkClass}>
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Prayer Times</span>
        </NavLink>

        <NavLink to="/quran" className={getLinkClass}>
          <Book className="w-6 h-6" />
          <span className="text-xs">AI Quran</span>
        </NavLink>

        <NavLink to="/duas" className={getLinkClass}>
          <Heart className="w-6 h-6" />
          <span className="text-xs">Duas</span>
        </NavLink>

        <NavLink to="/more" className={getLinkClass}>
          <div className="w-6 h-6 flex items-center justify-center">•••</div>
          <span className="text-xs">More</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNavigation;
