import * as React from "react";
import logo from "./prayer_time.ico";

interface ILoadingProps {}

const Loading: React.FunctionComponent<ILoadingProps> = () => {
  return (
    <div class="flex items-center justify-center h-screen">
      <img src={logo} alt="" />
    </div>
  );
};

export default Loading;
