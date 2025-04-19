import * as React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { Link } from "react-router";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return (
    <>
      {/* Header */}
      <header className="p-4 flex justify-between items-center text-black-primary">
        <Link className="text-xl font-semibold" to={"/"}>
          Prayer Times
        </Link>

        <div className="flex gap-4 items-center">
          <a href="/prayer-calender">
            <FaRegCalendarAlt size={24} />
          </a>
          <SlOptionsVertical size={20} />
        </div>
      </header>
    </>
  );
};

export default Header;
