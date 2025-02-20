import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootElement from "./Root.tsx";
// import "./index.css";
import HomePage from "./pages/home/Home.tsx";
import PrayerTimesPage from "./pages/prayer-time/PrayerTimePage.tsx";
import QuranPage from "./pages/quran/Quran.tsx";
import DuasPage from "./pages/duas/Duas.tsx";
import MorePage from "./pages/more/More.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootElement />,
    children: [
      {
        index: true,
        element: <PrayerTimesPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "prayer-time",
        element: <PrayerTimesPage />,
      },
      {
        path: "quran",
        element: <QuranPage />,
      },
      {
        path: "duas",
        element: <DuasPage />,
      },
      {
        path: "more",
        element: <MorePage />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
} else {
  console.error("Root element not found");
}
