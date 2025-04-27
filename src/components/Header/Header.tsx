import * as React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { BsCalendarEvent } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import useHeaderStore from "../../store/useHeaderStore";
import { LocationSettingsDrawer } from "../LocationSettingsDrawer/LocationSettingsDrawer";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  const { isCalender, setCalender } = useHeaderStore();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const isCalenderPage = pathname === "/prayer-calender";
  const isPrayerPage = pathname === "/";

  React.useEffect(() => {
    if (isCalenderPage) {
      setCalender(true);
    } else if (isPrayerPage) {
      setCalender(false);
    }
  }, [pathname, setCalender, isCalenderPage, isPrayerPage]);

  return (
    <>
      {/* Header */}
      <header className="p-4 flex justify-between items-center text-black-primary">
        <Link className="text-xl font-semibold" to={"/"}>
          Prayer Times
        </Link>

        <div className="flex gap-4 items-center">
          {!isCalender && (
            <Link to={"/prayer-calender"}>
              <FaRegCalendarAlt size={24} />
            </Link>
          )}

          {isCalender && (
            <Link to={"/"}>
              <BsCalendarEvent size={22} />
            </Link>
          )}

          <span
            onClick={() => setIsDrawerOpen(true)}
            className="cursor-pointer"
          >
            <SlOptionsVertical size={20} />
          </span>
          
          <LocationSettingsDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
