import * as React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return (
    <>
      {/* Header */}
      <header className="p-4 flex justify-between items-center text-black-primary">
        <h1 className="text-xl font-semibold">Prayer Times</h1>

        <div className="flex gap-4 items-center">
          <FaRegCalendarAlt size={24} />
          <SlOptionsVertical size={20} />
        </div>
      </header>
    </>
  );
};

export default Header;
