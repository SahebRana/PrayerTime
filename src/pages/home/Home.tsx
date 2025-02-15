import * as React from "react";

interface IHomePageProps {}

const HomePage: React.FunctionComponent<IHomePageProps> = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
      {/* Add your home page content here */}
    </div>
  );
};

export default HomePage;
