import { Calendar, Share2 } from "lucide-react";
import * as React from "react";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return (
    <>
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Prayer Times</h1>
        <div className="flex gap-4">
          <Share2 className="w-6 h-6" />
          <Calendar className="w-6 h-6" />
        </div>
      </header>
    </>
  );
};

export default Header;
